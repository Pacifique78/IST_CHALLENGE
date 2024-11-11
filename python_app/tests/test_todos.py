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
