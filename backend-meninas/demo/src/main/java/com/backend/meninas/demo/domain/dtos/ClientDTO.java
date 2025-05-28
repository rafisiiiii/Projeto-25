package com.backend.meninas.demo.domain.dtos;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientDTO {
    
    @NotBlank
    @Min(6)
    @Max(6)
    private String code;
    
    @NotBlank
    @Min(3)
    @Max(255)
    private String name;

    @Min(3)
    @Max(255)
    @Email
    private String email;

    @Min(8)
    @Max(9)
    @Pattern(regexp = "\\d+")
    private String phone;

    private String homepage;

    @Min(2)
    @Max(2)
    @Pattern(regexp = "\\d+")
    private String areaCode;

    @Min(11)
    @Max(14)
    @Pattern(regexp = "\\d+")
    private String taxId;

    private String tradeName;

    private String openingDate;

    private String type;

    private String address;

    private String state;

    private String neighborhood;

    private String city;

    private String cityCode;

    private String zipCode;

    @Pattern(regexp = "\\d+")
    private String storeCode;

    private UUID authorId;
}
