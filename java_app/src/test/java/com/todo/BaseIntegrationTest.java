package com.todo;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

@SpringBootTest
@ActiveProfiles("test")
public abstract class BaseIntegrationTest {

    @Autowired
    private DataSource dataSource;

    @BeforeEach
    void cleanDatabase() {
        try (Connection conn = dataSource.getConnection()) {
            // Disable foreign key checks
            Statement stmt = conn.createStatement();
            stmt.execute("SET CONSTRAINTS ALL DEFERRED");

            // Clean all tables
            stmt.execute("TRUNCATE TABLE todos CASCADE");
            stmt.execute("TRUNCATE TABLE users CASCADE");

            // Enable foreign key checks
            stmt.execute("SET CONSTRAINTS ALL IMMEDIATE");
        } catch (SQLException e) {
            throw new RuntimeException("Failed to clean database", e);
        }
    }
}