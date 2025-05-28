package com.backend.meninas.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.meninas.demo.controllers.dtos.AuthDTO;
import com.backend.meninas.demo.services.dtos.AuthDTO.AuthUserDTO;
import com.backend.meninas.demo.services.UserServices;
import com.backend.meninas.demo.services.dtos.AuthDTO.RegisterUserDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class UserControllers {
    
    @Autowired
    private UserServices userServices;

    @PostMapping("/register")
    ResponseEntity<Object> register(@Valid @RequestBody AuthDTO.RegisterUserBodyDTO registerUserDTO) {
        try{
            
            var registerUserDto = new RegisterUserDTO(
                registerUserDTO.getName(), 
                registerUserDTO.getEmail(), 
                registerUserDTO.getPassword()
            );

            this.userServices.register(registerUserDto);
            
            return ResponseEntity.ok().build();
            
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    ResponseEntity<Object> auth(@RequestBody AuthDTO.AuthenticateUserBodyDTO authenticateUserDTO){
        try{
            var authUserDto = new AuthUserDTO(authenticateUserDTO.getEmail(), authenticateUserDTO.getPassword());

            var result = this.userServices.login(authUserDto);
            return ResponseEntity.ok().body(result);
        }catch(Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    } 

}
