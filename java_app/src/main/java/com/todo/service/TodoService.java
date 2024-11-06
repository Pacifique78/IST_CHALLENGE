package com.todo.service;

import com.todo.dto.TodoRequest;
import com.todo.dto.TodoResponse;
import com.todo.exception.NotFoundException;
import com.todo.model.Todo;
import com.todo.model.User;
import com.todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;

    public TodoResponse createTodo(TodoRequest request, User user) {
        Todo todo = new Todo();
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setUser(user);

        Todo savedTodo = todoRepository.save(todo);
        return convertToResponse(savedTodo);
    }

    public List<TodoResponse> getUserTodos(User user) {
        return todoRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public TodoResponse getTodoById(UUID todoId, User user) {
        Todo todo = todoRepository.findByIdAndUserId(todoId, user.getId())
                .orElseThrow(() -> new NotFoundException("Todo not found"));
        return convertToResponse(todo);
    }

    private TodoResponse convertToResponse(Todo todo) {
        TodoResponse response = new TodoResponse();
        response.setId(todo.getId());
        response.setTitle(todo.getTitle());
        response.setDescription(todo.getDescription());
        response.setCompleted(todo.isCompleted());
        response.setCreatedAt(todo.getCreatedAt());
        response.setUpdatedAt(todo.getUpdatedAt());
        return response;
    }
}