package com.todo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.todo.dto.LoginRequest;
import com.todo.dto.SignupRequest;
import com.todo.model.User;
import com.todo.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Authentication", description = "Authentication management APIs")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @Operation(summary = "User Registration", description = "Register a new user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully registered"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "409", description = "Email already exists")
    })
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        User user = userService.signup(request);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User created successfully");
        response.put("user", new HashMap<String, Object>() {{
            put("id", user.getId());
            put("name", user.getName());
            put("email", user.getEmail());
        }});
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "User Login", description = "Authenticate user and get JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully authenticated"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String token = userService.login(request);
        User user = userService.getCurrentUser(request.getEmail());
        Map<String, Object> response = new HashMap<>();
        response.put("access_token", token);
        response.put("user", new HashMap<String, Object>() {{
            put("id", user.getId());
            put("name", user.getName());
            put("email", user.getEmail());
        }});
        return ResponseEntity.ok(response);
    }
}
