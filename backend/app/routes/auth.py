from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.models import User
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ['username', 'email', 'password']):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if user already exists
    existing_user = User.find_by_email(data['email'])
    if existing_user:
        return jsonify({'message': 'Email already registered'}), 409
    
    # Create new user
    user_id = User.create(data['username'], data['email'], data['password'])
    
    # Create access token
    expires = datetime.timedelta(days=7)
    token = create_access_token(identity=user_id, expires_delta=expires)
    
    return jsonify({
        'message': 'User registered successfully',
        'userId': user_id,
        'token': token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ['email', 'password']):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Find user by email
    user = User.find_by_email(data['email'])
    if not user:
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Verify password
    if not User.verify_password(user['password'], data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Create access token
    expires = datetime.timedelta(days=7)
    token = create_access_token(identity=user['userId'], expires_delta=expires)
    
    return jsonify({
        'message': 'Login successful',
        'userId': user['userId'],
        'token': token
    }), 200
