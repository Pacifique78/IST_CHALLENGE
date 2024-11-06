package com.todo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.config.TestSecurityConfig;
import com.todo.dto.TodoRequest;
import com.todo.dto.TodoResponse;
import com.todo.exception.NotFoundException;
import com.todo.model.User;
import com.todo.service.TodoService;
import com.todo.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TodoService todoService;

    @MockBean
    private UserService userService;

    private User testUser;
    private TodoResponse testTodoResponse;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("test@example.com");
        testUser.setName("Test User");

        testTodoResponse = new TodoResponse();
        testTodoResponse.setId(UUID.randomUUID());
        testTodoResponse.setTitle("Test Todo");
        testTodoResponse.setDescription("Test Description");
        testTodoResponse.setCompleted(false);
        testTodoResponse.setCreatedAt(LocalDateTime.now());
        testTodoResponse.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void createTodo_Success() throws Exception {
        TodoRequest request = new TodoRequest();
        request.setTitle("Test Todo");
        request.setDescription("Test Description");

        when(userService.getCurrentUser("test@example.com")).thenReturn(testUser);
        when(todoService.createTodo(any(TodoRequest.class), eq(testUser)))
                .thenReturn(testTodoResponse);

        mockMvc.perform(post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(request.getTitle()))
                .andExpect(jsonPath("$.description").value(request.getDescription()))
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void createTodo_WithMissingTitle() throws Exception {
        TodoRequest request = new TodoRequest();
        request.setDescription("Test Description");

        when(userService.getCurrentUser("test@example.com")).thenReturn(testUser);

        mockMvc.perform(post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getTodos_Success() throws Exception {
        when(userService.getCurrentUser("test@example.com")).thenReturn(testUser);
        when(todoService.getUserTodos(testUser))
                .thenReturn(Arrays.asList(testTodoResponse, testTodoResponse));

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title").value("Test Todo"))
                .andExpect(jsonPath("$[0].description").value("Test Description"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getTodos_EmptyList() throws Exception {
        when(userService.getCurrentUser("test@example.com")).thenReturn(testUser);
        when(todoService.getUserTodos(testUser)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getTodoById_Success() throws Exception {
        UUID todoId = UUID.randomUUID();
        testTodoResponse.setId(todoId);

        when(userService.getCurrentUser("test@example.com")).thenReturn(testUser);
        when(todoService.getTodoById(todoId, testUser)).thenReturn(testTodoResponse);

        mockMvc.perform(get("/api/todos/" + todoId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(todoId.toString()))
                .andExpect(jsonPath("$.title").value("Test Todo"))
                .andExpect(jsonPath("$.description").value("Test Description"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getTodoById_NotFound() throws Exception {
        UUID todoId = UUID.randomUUID();

        when(userService.getCurrentUser("test@example.com")).thenReturn(testUser);
        when(todoService.getTodoById(todoId, testUser))
                .thenThrow(new NotFoundException("Todo not found"));

        mockMvc.perform(get("/api/todos/" + todoId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    @Test
    void getTodoById_Unauthorized() throws Exception {
        UUID todoId = UUID.randomUUID();
        mockMvc.perform(get("/api/todos/" + todoId))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getTodoById_InvalidUUID() throws Exception {
        when(userService.getCurrentUser("test@example.com")).thenReturn(testUser);

        mockMvc.perform(get("/api/todos/invalid-uuid"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }
}