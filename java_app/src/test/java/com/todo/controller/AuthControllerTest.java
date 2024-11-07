package com.todo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.TodoApplication;
import com.todo.config.TestConfig;
import com.todo.config.TestSecurityConfig;
import com.todo.dto.LoginRequest;
import com.todo.dto.SignupRequest;
import com.todo.exception.ConflictException;
import com.todo.exception.UnauthorizedException;
import com.todo.model.User;
import com.todo.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = {
    TodoApplication.class,  // Your main application class
    TestSecurityConfig.class  // Test security configuration
})
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @Test
    void signup_Success() throws Exception {
        SignupRequest request = new SignupRequest();
        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("testpass123");

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        when(userService.signup(any(SignupRequest.class))).thenReturn(user);

        mockMvc.perform(post("/api/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User created successfully"))
                .andExpect(jsonPath("$.user.name").value(request.getName()))
                .andExpect(jsonPath("$.user.email").value(request.getEmail()));
    }

    @Test
    void signup_WithExistingEmail_ReturnsConflict() throws Exception {
        SignupRequest request = new SignupRequest();
        request.setName("Test User");
        request.setEmail("existing@example.com");
        request.setPassword("testpass123");

        when(userService.signup(any(SignupRequest.class)))
                .thenThrow(new ConflictException("Email already registered"));

        mockMvc.perform(post("/api/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Conflict"));
    }

    @Test
    void signup_WithInvalidData() throws Exception {
        SignupRequest request = new SignupRequest();
        // Missing required fields
        mockMvc.perform(post("/api/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_Success() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("testpass123");

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName("Test User");
        user.setEmail(request.getEmail());

        String token = "test.jwt.token";
        when(userService.login(any(LoginRequest.class))).thenReturn(token);
        when(userService.getCurrentUser(request.getEmail())).thenReturn(user);

        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token").value(token))
                .andExpect(jsonPath("$.user.email").value(request.getEmail()));
    }

    @Test
    void login_WithInvalidCredentials_ReturnsUnauthorized() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrongpassword");

        when(userService.login(any(LoginRequest.class)))
                .thenThrow(new UnauthorizedException("Invalid email or password"));

        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    void login_WithMissingData() throws Exception {
        LoginRequest request = new LoginRequest();
        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}