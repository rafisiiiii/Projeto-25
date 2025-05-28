package com.backend.meninas.demo.repositories;

import org.springframework.stereotype.Service;

import com.backend.meninas.demo.domain.entities.User;
import com.backend.meninas.demo.domain.repositories.UserRepository;

@Service
public interface JpaUserRepository extends JpaBaseRepository<User>, UserRepository {} 