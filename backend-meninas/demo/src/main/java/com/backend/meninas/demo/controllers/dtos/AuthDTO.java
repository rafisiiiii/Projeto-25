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
        @Size(min = 3, max = 255, message = "Nome deve ter entre 3 e 255 caracteres")
        private String name;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        @Size(min = 6, max = 255, message = "Senha deve ter entre 6 e 255 caracteres")
        private String password;
    }

    @Data
    public static class AuthenticateUserBodyDTO {
        @NotBlank
        @Email(message = "Credenciais inválidas")
        private String email;

        @NotBlank
        @Size(min = 6, max = 255, message = "Credenciais inválidas")
        private String password;
    }
    

}
