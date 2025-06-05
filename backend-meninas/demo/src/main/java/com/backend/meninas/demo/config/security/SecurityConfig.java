package com.backend.meninas.demo.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Autowired 
    private CorsConfigurationSourceImpl configurationSourceImpl;
        
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf  -> csrf.disable())
        .authorizeHttpRequests(auth -> {
            auth.requestMatchers(
                "/auth/register", 
                "/auth/login",
                "/swagger-ui.html",         
                "/swagger-ui/**",         
                "/v3/api-docs/**",         
                "/v3/api-docs",            
                "/webjars/**",            
                "/swagger-resources/**"   
            ).permitAll();
            auth.anyRequest().authenticated();
        }) 
        .addFilterBefore(this.securityFilter, BasicAuthenticationFilter.class)
        .cors(cors -> cors.configurationSource(this.configurationSourceImpl));
        
        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}