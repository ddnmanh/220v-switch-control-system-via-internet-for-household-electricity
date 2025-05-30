package com.dnmanh.smartome.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(
    name = "users_register"
//    uniqueConstraints = @UniqueConstraint(columnNames = "username")
)
@Getter
@Setter
public class UserRegister {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    // Không đặt unique vì đã có service kiểm tra
    @NotBlank(message = "Email không được để trống")
    @Column(nullable = false)
    private String email;

    // Không đặt unique vì đã có service kiểm tra
    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Column(nullable = false)
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

    private Instant expiresAt;

    private Instant createdAt;
    private Instant updatedAt;

    @PrePersist
    public void handleBeforeCreate() {
        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedAt = Instant.now();
    }
}
