package com.todo.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Import;

@TestConfiguration
@Import({TestSecurityConfig.class})
public class TestConfig {
}