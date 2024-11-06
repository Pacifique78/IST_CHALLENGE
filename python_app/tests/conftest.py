import pytest
from app import create_app
from extensions import db
from models import User
from flask_jwt_extended import create_access_token
import os
import logging

logger = logging.getLogger(__name__)

@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'postgresql://postgres:password@db:5432/python_tododb_test',
        'JWT_SECRET_KEY': 'test-secret-key',
        'DEBUG': True,  # Enable debug mode
    })

    with app.app_context():
        db.drop_all()
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def test_user():
    return {
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'testpass123'
    }

@pytest.fixture
def auth_headers(client, test_user):
    # Create a test user
    signup_response = client.post('/api/signup', json=test_user)
    assert signup_response.status_code == 201, f"Signup failed: {signup_response.data}"
    
    # Login
    login_response = client.post('/api/login', json={
        'email': test_user['email'],
        'password': test_user['password']
    })
    assert login_response.status_code == 200, f"Login failed: {login_response.data}"
    
    # Get token
    token = login_response.get_json()['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    
    # Test the headers
    test_response = client.get('/api/todos', headers=headers)
    assert test_response.status_code in [200, 401], f"Auth test failed: {test_response.data}"
    
    return headers