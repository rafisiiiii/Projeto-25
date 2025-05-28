package com.backend.meninas.demo.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.backend.meninas.demo.repositories.JpaUserRepository;

import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private JWTProvider jwtProvider ;

    @Autowired JpaUserRepository userRepository;

    @Override
    protected void doFilterInternal(
       @NonNull HttpServletRequest request, 
       @NonNull HttpServletResponse response, 
       @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        SecurityContextHolder.getContext().setAuthentication(null);
        var header = request.getHeader("Authorization");

        if(header != null && header.startsWith("Bearer ")) {
            String token = header.replace("Bearer ", "");
            var subjectToken =  this.jwtProvider.validateJWT(token);
            
            if(subjectToken.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            var user = this.userRepository.findById(UUID.fromString(subjectToken.intern()));


            if(user.isEmpty()){
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            request.setAttribute("userId", subjectToken);
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(subjectToken, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }

}