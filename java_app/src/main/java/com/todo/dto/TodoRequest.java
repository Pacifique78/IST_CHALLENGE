package com.todo.dto;

import lombok.Data;
import javax.validation.constraints.*;

@Data
public class TodoRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    private String title;

    private String description;
}
