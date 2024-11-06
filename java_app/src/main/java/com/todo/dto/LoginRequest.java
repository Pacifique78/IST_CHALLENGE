package com.todo.dto;

import lombok.Data;
import javax.validation.constraints.*;

@Data
public class LoginRequest {
    @NotBlank
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank
    private String password;
}

