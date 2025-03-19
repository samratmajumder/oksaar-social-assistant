from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Interaction

interactions_bp = Blueprint('interactions', __name__)

@interactions_bp.route('', methods=['GET'])
@jwt_required()
def get_interactions():
    user_id = get_jwt_identity()
    
    # Get query parameters
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    
    # Get interactions from database
    result = Interaction.find_by_user_id(user_id, page, limit)
    
    # Convert MongoDB ObjectId to string for JSON serialization
    for interaction in result['items']:
        if '_id' in interaction:
            del interaction['_id']
    
    return jsonify(result), 200

@interactions_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_interaction_stats():
    user_id = get_jwt_identity()
    
    # Get stats from database
    stats = Interaction.get_stats(user_id)
    
    return jsonify(stats), 200
