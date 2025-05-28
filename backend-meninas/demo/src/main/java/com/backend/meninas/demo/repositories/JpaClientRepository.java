package com.backend.meninas.demo.repositories;

import org.springframework.stereotype.Service;

import com.backend.meninas.demo.domain.entities.Client;
import com.backend.meninas.demo.domain.repositories.ClientRepository;

@Service
public interface JpaClientRepository extends JpaBaseRepository<Client>, ClientRepository {}