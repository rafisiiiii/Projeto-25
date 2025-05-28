package com.backend.meninas.demo.services.dtos;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;


@Data
public class AuthDTO {

    @Data
    @AllArgsConstructor
    public static class RegisterUserDTO {
        private String name;
        private String email;
        private String password;
    }
    
    @Data
    @AllArgsConstructor
    public static class AuthUserDTO {
        private String email;
        private String password;
    }

    @Data
    @AllArgsConstructor
    public static class UserWithoutPassword {
        private UUID id;
        private String name;
        private String email;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    @AllArgsConstructor
    public static class UserAuthenticatedResponseDTO {
        private String access_token;
        private UserWithoutPassword user;
    }
        
}