from flask import Blueprint, request, jsonify
from models import Todo, User
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from uuid import UUID

bp = Blueprint('todos', __name__, url_prefix='/api/todos')

@bp.route('', methods=['POST'])
@jwt_required()
def create_todo():
    try:
        data = request.get_json()
        
        if not data or not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400
        
        user_id = get_jwt_identity()
        user = User.query.get(UUID(user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        todo = Todo(
            title=data['title'],
            description=data.get('description', ''),
            user_id=user.id
        )
        
        db.session.add(todo)
        db.session.commit()
        
        return jsonify({
            'id': str(todo.id),
            'title': todo.title,
            'description': todo.description,
            'completed': todo.completed,
            'created_at': todo.created_at.isoformat(),
            'updated_at': todo.updated_at.isoformat()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('', methods=['GET'])
@jwt_required()
def get_todos():
    try:
        user_id = get_jwt_identity()
        todos = Todo.query.filter_by(user_id=UUID(user_id)).order_by(Todo.created_at.desc()).all()
        
        return jsonify([{
            'id': str(todo.id),
            'title': todo.title,
            'description': todo.description,
            'completed': todo.completed,
            'created_at': todo.created_at.isoformat(),
            'updated_at': todo.updated_at.isoformat()
        } for todo in todos]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<todo_id>', methods=['GET'])
@jwt_required()
def get_todo(todo_id):
    try:
        user_id = get_jwt_identity()
        todo = Todo.query.filter_by(
            id=UUID(todo_id),
            user_id=UUID(user_id)
        ).first()
        
        if not todo:
            return jsonify({'error': 'Todo not found'}), 404
        
        return jsonify({
            'id': str(todo.id),
            'title': todo.title,
            'description': todo.description,
            'completed': todo.completed,
            'created_at': todo.created_at.isoformat(),
            'updated_at': todo.updated_at.isoformat()
        }), 200
        
    except ValueError:
        return jsonify({'error': 'Invalid todo ID format'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500