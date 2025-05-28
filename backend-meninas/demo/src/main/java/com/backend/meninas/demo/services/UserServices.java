package com.backend.meninas.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.meninas.demo.config.security.JWTProvider;
import com.backend.meninas.demo.domain.entities.User;
import com.backend.meninas.demo.helpers.exceptions.BadRequestException;
import com.backend.meninas.demo.repositories.JpaUserRepository;
import com.backend.meninas.demo.services.dtos.AuthDTO;

@Service
public class UserServices {
    
    @Autowired
    private JpaUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTProvider jwtProvider;


    public void register(AuthDTO.RegisterUserDTO dto) throws BadRequestException {
        boolean userAlreadyExists = this.userRepository.findByEmail(dto.getEmail()).isPresent();
        if(userAlreadyExists) {
            throw new BadRequestException("User already exists, please login");
        }
        
        User user = User.builder()
        .name(dto.getName())
        .email(dto.getEmail())
        .password(passwordEncoder.encode(dto.getPassword()))
        .build();

        this.userRepository.save(user);
    }


    public AuthDTO.UserAuthenticatedResponseDTO login(AuthDTO.AuthUserDTO dto) throws BadRequestException {
        var user = this.userRepository.findByEmail(dto
        .getEmail())
        .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        boolean isMatches = this.passwordEncoder.matches(dto.getPassword(), user.getPassword());

        if(!isMatches) {
            throw new BadRequestException("Invalid credentials");
        }
        String accessToken = this.jwtProvider.createJWT(user.getId().toString());
        AuthDTO.UserWithoutPassword userWithoutPassword = new AuthDTO.UserWithoutPassword(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt(), user.getUpdatedAt());
        return new AuthDTO.UserAuthenticatedResponseDTO(accessToken, userWithoutPassword);
    }


}
