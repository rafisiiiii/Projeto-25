package com.backend.meninas.demo.domain.entities;

import java.util.List;


import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper=false)
public class User extends BaseEntity {

    @NotBlank
    @Size(min = 3, max = 255)
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Email
    @Size(max = 255)
    @Column(nullable = false, updatable = false, unique = true)
    private String email;

    @NotBlank
    @Size(min = 6, max = 255)
    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
@JsonManagedReference
@ToString.Exclude
private List<Client> clients;
}
