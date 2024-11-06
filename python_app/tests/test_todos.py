import pytest
from models import Todo
from uuid import UUID

def test_create_todo_success(client, auth_headers):
    todo_data = {
        'title': 'Test Todo',
        'description': 'Test Description'
    }
    response = client.post(
        '/api/todos',
        json=todo_data,
        headers=auth_headers
    )
    print(f"Response data: {response.data}")  # Debug print
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    
    data = response.get_json()
    assert data['title'] == todo_data['title']
    assert data['description'] == todo_data['description']
    assert not data['completed']
    assert 'id' in data

def test_create_todo_missing_title(client, auth_headers):
    response = client.post(
        '/api/todos',
        json={'description': 'Test Description'},
        headers=auth_headers
    )
    print(f"Response data: {response.data}")  # Debug print
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Title is required'

def test_get_todos_empty(client, auth_headers):
    response = client.get('/api/todos', headers=auth_headers)
    print(f"Response data: {response.data}")  # Debug print
    assert response.status_code == 200
    assert response.get_json() == []

def test_get_todos_with_data(client, auth_headers):
    # Create a todo first
    create_response = client.post(
        '/api/todos',
        json={'title': 'Test Todo', 'description': 'Test Description'},
        headers=auth_headers
    )
    assert create_response.status_code == 201, f"Failed to create todo: {create_response.data}"

    # Get all todos
    response = client.get('/api/todos', headers=auth_headers)
    print(f"Response data: {response.data}")  # Debug print
    assert response.status_code == 200
    
    todos = response.get_json()
    assert len(todos) == 1
    assert todos[0]['title'] == 'Test Todo'

def test_get_todo_by_id_success(client, auth_headers):
    # Create a todo first
    create_response = client.post(
        '/api/todos',
        json={'title': 'Test Todo', 'description': 'Test Description'},
        headers=auth_headers
    )
    assert create_response.status_code == 201
    todo_id = create_response.get_json()['id']

    # Get specific todo
    response = client.get(f'/api/todos/{todo_id}', headers=auth_headers)
    print(f"Response data: {response.data}")  # Debug print
    assert response.status_code == 200
    
    todo = response.get_json()
    assert todo['id'] == todo_id
    assert todo['title'] == 'Test Todo'

def test_get_todo_by_id_not_found(client, auth_headers):
    fake_uuid = '123e4567-e89b-12d3-a456-426614174000'
    response = client.get(f'/api/todos/{fake_uuid}', headers=auth_headers)
    print(f"Response data: {response.data}")  # Debug print
    assert response.status_code == 404

def test_get_todo_by_id_invalid_uuid(client, auth_headers):
    response = client.get('/api/todos/not-a-uuid', headers=auth_headers)
    print(f"Response data: {response.data}")  # Debug print
    assert response.status_code == 400

def test_get_todo_unauthorized(client):
    response = client.get('/api/todos')
    assert response.status_code == 401

def test_get_todo_by_id_unauthorized(client):
    fake_uuid = '123e4567-e89b-12d3-a456-426614174000'
    response = client.get(f'/api/todos/{fake_uuid}')
    assert response.status_code == 401