from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    
    # Get user from database
    user = User.find_by_id(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Create profile response without sensitive fields
    profile = {
        'userId': user['userId'],
        'username': user['username'],
        'email': user['email'],
        'topics': user.get('topics', []),
        'articleUrls': user.get('articleUrls', []),
        'purpose': user.get('purpose', ''),
        'tone': user.get('tone', ''),
        'searchCriteria': user.get('searchCriteria', ''),
        'schedule': user.get('schedule', '')
    }
    
    return jsonify(profile), 200

@profile_bp.route('', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate input data
    allowed_fields = ['topics', 'articleUrls', 'purpose', 'tone', 'searchCriteria', 'schedule']
    profile_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    # Update profile
    success = User.update_profile(user_id, profile_data)
    if not success:
        return jsonify({'message': 'Failed to update profile'}), 400
    
    return jsonify({'message': 'Profile updated successfully'}), 200
