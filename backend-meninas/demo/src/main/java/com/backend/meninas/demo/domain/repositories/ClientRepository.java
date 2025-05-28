package com.backend.meninas.demo.domain.repositories;

import java.util.Optional;

import com.backend.meninas.demo.domain.entities.Client;

public interface ClientRepository extends BaseRepository<Client> {
    Optional<Client> findByCode(String code);
    Optional<Client> findByTaxId(String taxId);
}