from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    # Initialize Flask application
    app = Flask(__name__)
    CORS(app)
    
    # Configure application
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-for-development')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-dev-key')
    app.config['MONGO_URI'] = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/social_assistant')
    
    # Initialize extensions
    jwt = JWTManager(app)
    
    # Register blueprints
    from app.routes import auth_bp, profile_bp, posts_bp, interactions_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    app.register_blueprint(interactions_bp, url_prefix='/api/interactions')
    
    # Add stats endpoint
    from app.routes.stats import stats_bp
    app.register_blueprint(stats_bp, url_prefix='/api/stats')
    
    return app
