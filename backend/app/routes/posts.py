from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Post, User
from app.services.content_generator import generate_post_content
from app.services.social_media import post_to_platforms

posts_bp = Blueprint('posts', __name__)

@posts_bp.route('', methods=['GET'])
@jwt_required()
def get_posts():
    user_id = get_jwt_identity()
    
    # Get query parameters
    status = request.args.get('status')
    limit = int(request.args.get('limit', 100))
    
    # Get posts from database
    posts = Post.find_by_user_id(user_id, status, limit)
    
    # Convert MongoDB ObjectId to string for JSON serialization
    for post in posts:
        if '_id' in post:
            del post['_id']
    
    return jsonify(posts), 200

@posts_bp.route('/<post_id>', methods=['GET'])
@jwt_required()
def get_post(post_id):
    user_id = get_jwt_identity()
    
    # Get post from database
    post = Post.find_by_id(post_id)
    if not post:
        return jsonify({'message': 'Post not found'}), 404
    
    # Verify post belongs to user
    if post['userId'] != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    # Convert MongoDB ObjectId to string for JSON serialization
    if '_id' in post:
        del post['_id']
    
    return jsonify(post), 200

@posts_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_post():
    user_id = get_jwt_identity()
    
    # Get user profile for content generation
    user = User.find_by_id(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Generate post content
    try:
        content, image_url = generate_post_content(user)
        
        # Create post in database
        post_id = Post.create(user_id, content, image_url)
        
        return jsonify({
            'message': 'Post generated successfully',
            'postId': post_id
        }), 201
    except Exception as e:
        return jsonify({'message': f'Error generating post: {str(e)}'}), 500

@posts_bp.route('/<post_id>/approve', methods=['PUT'])
@jwt_required()
def approve_post(post_id):
    user_id = get_jwt_identity()
    
    # Get post from database
    post = Post.find_by_id(post_id)
    if not post:
        return jsonify({'message': 'Post not found'}), 404
    
    # Verify post belongs to user
    if post['userId'] != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    # Update post status
    success = Post.update_status(post_id, 'Approved')
    if not success:
        return jsonify({'message': 'Failed to approve post'}), 400
    
    # Post to social media platforms (async)
    try:
        # This would typically be done asynchronously
        post_to_platforms(post)
        
        # Update post status to Posted
        Post.update_status(post_id, 'Posted')
    except Exception as e:
        # Log error but don't fail the request
        print(f"Error posting to social media: {str(e)}")
    
    return jsonify({'message': 'Post approved and scheduled for posting'}), 200

@posts_bp.route('/<post_id>/reject', methods=['PUT'])
@jwt_required()
def reject_post(post_id):
    user_id = get_jwt_identity()
    
    # Get post from database
    post = Post.find_by_id(post_id)
    if not post:
        return jsonify({'message': 'Post not found'}), 404
    
    # Verify post belongs to user
    if post['userId'] != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    # Update post status
    success = Post.update_status(post_id, 'Rejected')
    if not success:
        return jsonify({'message': 'Failed to reject post'}), 400
    
    return jsonify({'message': 'Post rejected'}), 200
