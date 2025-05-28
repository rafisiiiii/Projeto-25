package com.backend.meninas.demo.domain.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper=false)
public class Client extends BaseEntity {
    
    @NotBlank
    @Size(min = 6, max = 6)
    @Column(nullable = false, updatable = false, unique = true)
    private String code;
    
    @NotBlank
    @Size(min=3, max = 255)
    @Column(nullable = false, updatable = true)
    private String name;

    @Size(min=1, max = 255)
    @Email
    @Column(nullable = true, updatable = true)
    private String email;
    
    
    @Size(min = 8, max = 9)
    @Pattern(regexp = "\\d+")
    @Column(nullable = true, updatable = true)
    private String phone;

    @Column(nullable = true, updatable = true)
    private String homepage;

    
    @Size(min = 2, max = 2)
    @Pattern(regexp = "\\d+")
    @Column(nullable = true, updatable = true, name = "area_code")
    private String areaCode;

    @Size(min = 11, max = 14)
    @Pattern(regexp = "\\d+")
    @Column(nullable = true, updatable = true, name = "tax_id")
    private String taxId;
    
    @Column(nullable = true, updatable = true, name = "trade_name")
    private String tradeName;

    @Column(nullable = true, updatable = true, name = "opening_date")
    private String openingDate;
    
    @Column(nullable = true, updatable = true)
    private String type;

    @Column(nullable = false, updatable = true)
    private String address;
    
    @Column(nullable = false, updatable = true)
    private String state;
    
    @Column(nullable = false, updatable = true)
    private String neighborhood;
    
    @Column(nullable = false, updatable = true)
    private String city;
    
    @Column(nullable = true, updatable = true)
    private String country;
    
    @Column(nullable = true, updatable = true, name = "city_code")
    private String cityCode;

    @Column(nullable = true, updatable = true, name = "zip_code")
    private String zipCode;

    @Column(nullable = false, updatable = false, name = "store_code")
    private String storeCode;


    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    @JsonBackReference
    private User author;
}
