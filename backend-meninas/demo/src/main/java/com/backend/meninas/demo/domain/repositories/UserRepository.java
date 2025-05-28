package com.backend.meninas.demo.domain.repositories;

import java.util.Optional;

import com.backend.meninas.demo.domain.entities.User;

public interface UserRepository extends BaseRepository<User> {
    Optional<User> findByEmail(String email);
}