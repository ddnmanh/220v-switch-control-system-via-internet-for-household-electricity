package com.dnmanh.smartome.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "otp_user_register")
@Getter
@Setter
public class OtpUserRegister {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String otp;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @ManyToOne()
    @JoinColumn(name = "id_user_register")
    @JsonIgnore
    private UserRegister userRegister;

    @PrePersist
    public void handleBeforeCreate() {
        this.createdAt = Instant.now();
    }

}
