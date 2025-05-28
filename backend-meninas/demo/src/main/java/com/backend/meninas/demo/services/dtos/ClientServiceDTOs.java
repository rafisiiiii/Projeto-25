package com.backend.meninas.demo.services.dtos;

import java.util.List;
import java.util.UUID;

import com.backend.meninas.demo.domain.entities.Client;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class ClientServiceDTOs {
    
    @Data
    @AllArgsConstructor
    public static class RegisterClientDTO {
  
        private String name;

        private String email;

        private String phone;

        private String homepage;

        private String areaCode;

        private String taxId;

        private String tradeName;

        private String openingDate;

        private String type;

        private String address;

        private String state;

        private String neighborhood;

        private String city;

        private String cityCode;

        private String country;

        private String zipCode;

        private String storeCode;

        private UUID authorId;
    }
    
    @Data
    @AllArgsConstructor
    public static class UpdateClientDTO {
        
        private String code;

        private String name;

        private String email;

        private String phone;

        private String homepage;

        private String areaCode;

        private String address;

        private String state;

        private String neighborhood;

        private String city;

        private String country;

        private String cityCode;

        private String zipCode;

    }

    @Data
    @AllArgsConstructor
    public static class ListClientDTO {
        List<Client> clients;
    }


}
