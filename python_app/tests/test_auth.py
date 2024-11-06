from models import User

def test_signup_success(client, test_user):
    response = client.post('/api/signup', json=test_user)
    assert response.status_code == 201
    data = response.get_json()
    
    assert 'user' in data
    assert data['user']['name'] == test_user['name']
    assert data['user']['email'] == test_user['email']
    assert 'id' in data['user']
    assert 'created_at' in data['user']
    assert 'password' not in data['user']

def test_signup_duplicate_email(client, test_user):
    # First signup
    response = client.post('/api/signup', json=test_user)
    assert response.status_code == 201
    
    # Try to signup with same email
    response = client.post('/api/signup', json={
        'name': 'Another User',
        'email': test_user['email'],
        'password': 'different_password'
    })
    assert response.status_code == 409
    assert b'Email already registered' in response.data

def test_signup_invalid_email(client, test_user):
    invalid_user = dict(test_user)
    invalid_user['email'] = 'invalid-email'
    
    response = client.post('/api/signup', json=invalid_user)
    assert response.status_code == 400
    assert b'Invalid email format' in response.data

def test_signup_missing_fields(client):
    response = client.post('/api/signup', json={
        'name': 'Test User'
    })
    assert response.status_code == 400
    assert b'Name, email, and password are required' in response.data

def test_signup_short_password(client, test_user):
    invalid_user = dict(test_user)
    invalid_user['password'] = '12345'  # Too short
    
    response = client.post('/api/signup', json=invalid_user)
    assert response.status_code == 400
    assert b'Password must be at least 6 characters long' in response.data

def test_signup_short_name(client, test_user):
    invalid_user = dict(test_user)
    invalid_user['name'] = 'A'  # Too short
    
    response = client.post('/api/signup', json=invalid_user)
    assert response.status_code == 400
    assert b'Name must be at least 2 characters long' in response.data

def test_login_success(client, test_user):
    # First create a user
    client.post('/api/signup', json=test_user)
    
    # Then try to login
    response = client.post('/api/login', json={
        'email': test_user['email'],
        'password': test_user['password']
    })
    assert response.status_code == 200
    data = response.get_json()
    
    assert 'access_token' in data
    assert 'user' in data
    assert data['user']['email'] == test_user['email']
    assert data['user']['name'] == test_user['name']
    assert 'id' in data['user']

def test_login_wrong_password(client, test_user):
    # First create a user
    client.post('/api/signup', json=test_user)
    
    # Try to login with wrong password
    response = client.post('/api/login', json={
        'email': test_user['email'],
        'password': 'wrongpass'
    })
    assert response.status_code == 401
    assert b'Invalid email or password' in response.data

def test_login_nonexistent_email(client):
    response = client.post('/api/login', json={
        'email': 'nonexistent@example.com',
        'password': 'testpass123'
    })
    assert response.status_code == 401
    assert b'Invalid email or password' in response.data

def test_login_missing_fields(client):
    response = client.post('/api/login', json={
        'email': 'test@example.com'
    })
    assert response.status_code == 400
    assert b'Email and password are required' in response.data