package com.backend.meninas.demo.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.meninas.demo.domain.entities.BaseEntity;

public interface JpaBaseRepository<T extends BaseEntity> extends JpaRepository<T, UUID> {}