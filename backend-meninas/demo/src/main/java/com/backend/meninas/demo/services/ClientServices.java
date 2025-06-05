package com.backend.meninas.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.meninas.demo.domain.entities.Client;
import com.backend.meninas.demo.helpers.exceptions.BadRequestException;
import com.backend.meninas.demo.helpers.exceptions.NotFoundException;
import com.backend.meninas.demo.repositories.JpaClientRepository;
import com.backend.meninas.demo.repositories.JpaUserRepository;
import com.backend.meninas.demo.services.dtos.ClientServiceDTOs;

import  com.backend.meninas.demo.helpers.Utils;

@Service
public class ClientServices {
    
    @Autowired
    JpaClientRepository clientRepository;

    @Autowired
    JpaUserRepository userRepository;

    @Autowired
    SendEmailService sendEmailService;

    public void register(ClientServiceDTOs.RegisterClientDTO dto) throws BadRequestException, NotFoundException {  
      
     var _client = this.clientRepository.findByTaxId(dto.getTaxId());
        
     if(_client.isPresent()){
      throw new BadRequestException("Cliente com esse CNPJ/CPF já cadastrado");
     }
       
      var code = Utils.randomString(6, "a");  
      System.out.println(code);
      var author = this.userRepository.findById(dto.getAuthorId())
      .orElseThrow(() -> new NotFoundException("ID de autor inválido"));

      Client client = new Client(
        code,
        dto.getName(),
        dto.getEmail(),
        dto.getPhone(),
        dto.getHomepage(),  
        dto.getAreaCode(),
        dto.getTaxId(),
        dto.getTradeName(),
        dto.getOpeningDate(),
        dto.getType(),
        dto.getAddress(),
        dto.getState(),
        dto.getNeighborhood(),
        dto.getCity(),
        dto.getCountry(),
        dto.getCityCode(),
        dto.getZipCode(),
        dto.getStoreCode(), 
        author
        );

        this.clientRepository.save(client);
        this.sendEmailService.sendConfirmationEmail(client, author.getEmail());
    }


    public void update(ClientServiceDTOs.UpdateClientDTO dto) throws NotFoundException {
        var result = this.clientRepository.findByCode(dto.getCode());
        
        if(!result.isPresent()){
            throw new NotFoundException("Cliente não encontrado");
        }

        var client = result.get();

        client.setName(dto.getName());
        client.setEmail(dto.getEmail());
        client.setHomepage(dto.getHomepage());
        client.setAreaCode(dto.getAreaCode());
        client.setPhone(dto.getPhone());
        client.setAddress(dto.getAddress());
        client.setState(dto.getState());
        client.setNeighborhood(dto.getNeighborhood());
        client.setCity(dto.getCity());
        client.setCountry(dto.getCountry());
        client.setCityCode(dto.getCityCode());
        client.setZipCode(dto.getZipCode());
        
        this.clientRepository.save(client);
    }

    public List<Client> listClients () {
        var clients = this.clientRepository.findAll();
        return clients;
    }

    public void deleteClient(String code) throws NotFoundException {
       var client = this.clientRepository.findByCode(code)
        .orElseThrow(() -> new NotFoundException("Código de cliente inválido, cliente não encontrado"));
        this.clientRepository.delete(client);
    }

}
