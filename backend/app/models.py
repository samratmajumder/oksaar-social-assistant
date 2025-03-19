from flask import current_app
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import uuid

# MongoDB connection
def get_db():
    client = MongoClient(current_app.config['MONGO_URI'])
    return client.get_database()

# User model
class User:
    @staticmethod
    def create(username, email, password):
        db = get_db()
        user_id = str(uuid.uuid4())
        
        user = {
            'userId': user_id,
            'username': username,
            'email': email,
            'password': generate_password_hash(password),
            'topics': [],
            'articleUrls': [],
            'purpose': '',
            'tone': '',
            'searchCriteria': '',
            'schedule': '',
            'createdAt': datetime.datetime.utcnow()
        }
        
        db.users.insert_one(user)
        return user_id
    
    @staticmethod
    def find_by_email(email):
        db = get_db()
        return db.users.find_one({'email': email})
    
    @staticmethod
    def find_by_id(user_id):
        db = get_db()
        return db.users.find_one({'userId': user_id})
    
    @staticmethod
    def verify_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)
    
    @staticmethod
    def update_profile(user_id, profile_data):
        db = get_db()
        result = db.users.update_one(
            {'userId': user_id},
            {'$set': profile_data}
        )
        return result.modified_count > 0

# Post model
class Post:
    @staticmethod
    def create(user_id, content, image_url=None):
        db = get_db()
        post_id = str(uuid.uuid4())
        
        post = {
            'postId': post_id,
            'userId': user_id,
            'content': content,  # {micro, short, long}
            'imageUrl': image_url,
            'status': 'Pending',
            'platform': None,
            'createdAt': datetime.datetime.utcnow(),
            'postedAt': None
        }
        
        db.posts.insert_one(post)
        return post_id
    
    @staticmethod
    def find_by_id(post_id):
        db = get_db()
        return db.posts.find_one({'postId': post_id})
    
    @staticmethod
    def find_by_user_id(user_id, status=None, limit=100):
        db = get_db()
        query = {'userId': user_id}
        
        if status and status != 'All':
            query['status'] = status
            
        return list(db.posts.find(query).sort('createdAt', -1).limit(limit))
    
    @staticmethod
    def find_recent_by_user_id(user_id, limit=100):
        db = get_db()
        return list(db.posts.find({'userId': user_id}).sort('createdAt', -1).limit(limit))
    
    @staticmethod
    def update_status(post_id, status):
        db = get_db()
        
        updates = {
            'status': status
        }
        
        if status == 'Posted':
            updates['postedAt'] = datetime.datetime.utcnow()
        
        result = db.posts.update_one(
            {'postId': post_id},
            {'$set': updates}
        )
        
        return result.modified_count > 0

# Interaction model
class Interaction:
    @staticmethod
    def create(post_id, reply_content, platform=None):
        db = get_db()
        post = Post.find_by_id(post_id)
        
        if not post:
            return None
        
        interaction_id = str(uuid.uuid4())
        
        interaction = {
            'interactionId': interaction_id,
            'postId': post_id,
            'userId': post['userId'],
            'replyContent': reply_content,
            'platform': platform,
            'response': None,
            'respondedAt': None,
            'createdAt': datetime.datetime.utcnow()
        }
        
        db.interactions.insert_one(interaction)
        return interaction_id
    
    @staticmethod
    def find_by_id(interaction_id):
        db = get_db()
        return db.interactions.find_one({'interactionId': interaction_id})
    
    @staticmethod
    def find_by_user_id(user_id, page=1, limit=10):
        db = get_db()
        skip = (page - 1) * limit
        
        cursor = db.interactions.find({'userId': user_id}).sort('createdAt', -1).skip(skip).limit(limit)
        total = db.interactions.count_documents({'userId': user_id})
        
        return {
            'items': list(cursor),
            'total': total,
            'page': page,
            'limit': limit
        }
    
    @staticmethod
    def find_recent_by_user_id(user_id, limit=5):
        db = get_db()
        return list(db.interactions.find({'userId': user_id}).sort('createdAt', -1).limit(limit))
    
    @staticmethod
    def add_response(interaction_id, response):
        db = get_db()
        
        result = db.interactions.update_one(
            {'interactionId': interaction_id},
            {'$set': {
                'response': response,
                'respondedAt': datetime.datetime.utcnow()
            }}
        )
        
        return result.modified_count > 0
    
    @staticmethod
    def get_stats(user_id):
        db = get_db()
        
        total = db.interactions.count_documents({'userId': user_id})
        responded = db.interactions.count_documents({'userId': user_id, 'response': {'$ne': None}})
        pending = total - responded
        
        return {
            'total': total,
            'responded': responded,
            'pending': pending
        }
