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

    response = client.post('/api/login', json={
        'email': 'test@example.com'
    })
    assert response.status_code == 400
    assert b'Email and password are required' in response.data