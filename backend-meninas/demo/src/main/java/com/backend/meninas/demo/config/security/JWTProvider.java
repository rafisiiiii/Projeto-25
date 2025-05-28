package com.backend.meninas.demo.config.security;

import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;

@Service
public class JWTProvider {
    
    @Value("${security.token.secret}")
    private String secret;
    private String issuer = "api-java-meninas";


    public String createJWT(String content){
        Algorithm algorithm = Algorithm.HMAC256(this.secret);
       return JWT
               .create()
               .withIssuer(this.issuer).withExpiresAt(Instant.now().plus(Duration.ofHours(2)))
               .withSubject(content)
               .sign(algorithm);
    }

    public String validateJWT(String token) {
        Algorithm algorithm = Algorithm.HMAC256(this.secret);
        try{
            return JWT.require(algorithm).build().verify(token).getSubject();
        } catch (JWTVerificationException e) {
            return "";
        }

    }
}