// File: java_app/src/main/java/com/todo/config/OpenApiConfig.java

package com.todo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;
import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:5003}")
    private String serverPort;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    private final Environment environment;

    public OpenApiConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        
        return new OpenAPI()
            .info(new Info()
                .title("Todo Application API")
                .version("1.0")
                .description("API Documentation for Todo Application - Environment: " + activeProfile.toUpperCase())
                .license(new License()
                    .name("Apache 2.0")
                    .url("http://springdoc.org"))
                .contact(new Contact()
                    .name("Your Name")
                    .email("your.email@example.com")))
            .addSecurityItem(new SecurityRequirement()
                .addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                    .name(securitySchemeName)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("Provide the JWT token. Example: Bearer eyJhbGciOiJIUzI1...")))
            .servers(getServers());
    }

    private List<Server> getServers() {
        if (Arrays.asList(environment.getActiveProfiles()).contains("prod")) {
            return List.of(
                new Server()
                    .url("https://api.yourdomain.com")
                    .description("Production Server")
            );
        } else {
            return List.of(
                new Server()
                    .url("http://localhost:" + serverPort)
                    .description("Development Server")
            );
        }
    }
}