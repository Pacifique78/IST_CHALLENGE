package com.todo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.todo.model.Todo;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TodoRepository extends JpaRepository<Todo, UUID> {
    List<Todo> findByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<Todo> findByIdAndUserId(UUID id, UUID userId);
}
