package com.todo.dto;

import lombok.Data;
import javax.validation.constraints.*;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 2, message = "Name must be at least 2 characters long")
    private String name;

    @NotBlank
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
}