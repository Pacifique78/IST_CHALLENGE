from flask import Blueprint, request, jsonify
from models import User
from extensions import db
from flask_jwt_extended import create_access_token
import re

bp = Blueprint('auth', __name__, url_prefix='/api')

def is_valid_email(email):
    
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['name', 'email', 'password']):
            return jsonify({'error': 'Name, email, and password are required'}), 400
        
        # Validate email format
        if not is_valid_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
            
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        # Validate name length
        if len(data['name'].strip()) < 2:
            return jsonify({'error': 'Name must be at least 2 characters long'}), 400
            
        # Validate password length
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        user = User(
            name=data['name'].strip(),
            email=data['email'].lower()
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user': {
                'id': str(user.id),
                'name': user.name,
                'email': user.email,
                'created_at': user.created_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email'].lower()).first()
        
        if user and user.check_password(data['password']):
            access_token = create_access_token(
                identity=str(user.id),
                additional_claims={
                    'email': user.email,
                    'name': user.name
                }
            )
            return jsonify({
                'access_token': access_token,
                'user': {
                    'id': str(user.id),
                    'name': user.name,
                    'email': user.email
                }
            }), 200
        
        return jsonify({'error': 'Invalid email or password'}), 401
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500