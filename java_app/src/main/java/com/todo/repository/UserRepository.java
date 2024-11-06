package com.todo.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.todo.model.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}