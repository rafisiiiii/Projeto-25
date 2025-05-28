package com.backend.meninas.demo.domain.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.backend.meninas.demo.domain.entities.BaseEntity;

public interface BaseRepository<T extends BaseEntity> {
    T save(T entity);
    Optional<T> findById(UUID id);
    List<T> findAll();
    void deleteById(UUID id);
}
