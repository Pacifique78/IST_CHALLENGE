package com.todo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.todo.dto.LoginRequest;
import com.todo.dto.SignupRequest;
import com.todo.model.User;
import com.todo.service.UserService;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> checkHealthEntity() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "healthy");
        return ResponseEntity.ok(response);
    }

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
