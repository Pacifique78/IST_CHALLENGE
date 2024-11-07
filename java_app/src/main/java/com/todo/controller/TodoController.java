package com.todo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.todo.dto.TodoRequest;
import com.todo.dto.TodoResponse;
import com.todo.model.User;
import com.todo.service.TodoService;
import com.todo.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/todos")
@Tag(name = "Todos", description = "Todo management APIs")
@SecurityRequirement(name = "bearer-key")
@RequiredArgsConstructor
public class TodoController {
    private final TodoService todoService;
    private final UserService userService;

    @Operation(summary = "Create Todo", description = "Create a new todo for authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Todo created successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(
            @Valid @RequestBody TodoRequest request,
            Authentication authentication) {
        User user = userService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(todoService.createTodo(request, user));
    }

    @Operation(summary = "Get Todos", description = "Get all todos for authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Todos retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping
    public ResponseEntity<List<TodoResponse>> getTodos(Authentication authentication) {
        User user = userService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(todoService.getUserTodos(user));
    }

    @Operation(summary = "Get Todo by ID", description = "Get a todo by ID for authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Todo retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Todo not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> getTodoById(
            @PathVariable UUID id,
            Authentication authentication) {
        User user = userService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(todoService.getTodoById(id, user));
    }
}