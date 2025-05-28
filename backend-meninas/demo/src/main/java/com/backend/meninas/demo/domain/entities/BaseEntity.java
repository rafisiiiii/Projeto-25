package com.backend.meninas.demo.domain.entities;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Data;


@Data
@MappedSuperclass
public class BaseEntity implements Serializable {
    @Id
    private UUID id;

    @Column(name =  "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name =  "updated_at", updatable = false, nullable = false)
    private LocalDateTime updatedAt;


   @PrePersist
    protected void onCreate() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdated() {
        this.updatedAt = LocalDateTime.now();
    }
}
