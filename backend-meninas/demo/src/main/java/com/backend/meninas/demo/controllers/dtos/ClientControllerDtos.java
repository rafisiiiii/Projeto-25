package com.backend.meninas.demo.controllers.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class ClientControllerDtos {
    
    @Data
    public static class RegisterDto {
        
        @NotBlank
        @Size(min = 3, max = 255)
        private String name;

        
        @Size(min=1, max = 255)
        @Email
        private String email;

 
        @Size(min = 8, max = 9)
        @Pattern(regexp = "\\d+")
        private String phone;

        private String homepage;

        @Size(min = 2, max = 2)
        @Pattern(regexp = "\\d+")
        private String areaCode;


        @Size(min = 11, max = 14)
        @Pattern(regexp = "\\d+")
        private String taxId;

        private String tradeName;

        private String openingDate;

        private String type;

        private String address;

        private String state;

        private String neighborhood;

        private String city;

        private String country;

        private String cityCode;

        private String zipCode;

        @Pattern(regexp = "\\d+")
        private String storeCode;
    }

    @Data
    public static class UpdateDto {

    
        @NotBlank
        @Size(min= 3, max= 255)
        private String name;

        
        @Size(min=1, max= 255)
        @Email
        private String email;

 
        @Size(min= 8, max= 9)
        @Pattern(regexp = "\\d+")
        private String phone;

        private String homepage;

        @Size(min= 2, max= 2)
        @Pattern(regexp = "\\d+")
        private String areaCode;

        private String address;

        private String state;

        private String neighborhood;

        private String city;

        private String country;

        private String cityCode;

        private String zipCode;

        
    }
}
