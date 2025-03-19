from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Post, Interaction

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = get_jwt_identity()
    
    # Get posts stats
    pending_posts = len(Post.find_by_user_id(user_id, 'Pending'))
    active_posts = len(Post.find_by_user_id(user_id, 'Posted'))
    
    # Get interactions stats
    interaction_stats = Interaction.get_stats(user_id)
    
    return jsonify({
        'pendingPosts': pending_posts,
        'activePosts': active_posts,
        'interactions': interaction_stats['total']
    }), 200
