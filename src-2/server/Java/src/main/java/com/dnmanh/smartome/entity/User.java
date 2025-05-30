package com.dnmanh.smartome.entity;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import com.dnmanh.smartome.util.security.SecurityUtil;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(
    name = "users",
    uniqueConstraints = @UniqueConstraint(columnNames = "username")
)
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @NotBlank(message = "Email không được để trống")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

    @Column(name = "is_blocked", columnDefinition = "TINYINT DEFAULT 0")
    @ColumnDefault("false")
    private boolean isBlocked;

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    @ManyToOne
    @JoinColumn(name = "role_id")
    @JsonIgnore
    private Role role;

    @PrePersist
    public void handleBeforeCreate() {
        if (this.createdBy == null) {
            this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get()
                : "SYSTEM";
        }


        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        if (this.updatedBy == null) {
            this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get()
                : "SYSTEM";
        }

        this.updatedAt = Instant.now();
    }
}
