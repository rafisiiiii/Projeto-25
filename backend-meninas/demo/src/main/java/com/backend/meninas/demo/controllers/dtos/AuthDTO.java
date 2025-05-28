package com.backend.meninas.demo.controllers.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthDTO {
    
    @Data
    public static class RegisterUserBodyDTO {
        
        @NotBlank
        @Size(min = 3, max = 255, message = "Name must be between 3 and 255 characters")
        private String name;
        
        @NotBlank
        @Email
        private String email;
        
        @NotBlank
        @Size(min = 6, max = 255, message = "Name must be between 6 and 255 characters")
        private String password;
    }

    @Data
    public static class AuthenticateUserBodyDTO {
        @NotBlank
        @Email(message = "Invalid credentials")
        private String email;
        
        @NotBlank
        @Size(min = 6, max = 255, message = "Invalid credentials")
        private String password;
    }
    

}
