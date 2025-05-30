package com.dnmanh.smartome.entity;

import com.dnmanh.smartome.util.constant.DeviceType;
import com.dnmanh.smartome.util.security.SecurityUtil;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;


@Entity
@Table(name = "devices")
@Getter
@Setter
@NoArgsConstructor
public class Device {
    @Id
    @Column(name = "id", length = 6, nullable = false, unique = true)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private DeviceType type;

    @Column(name = "name", length = 30, nullable = false)
    private String name;

    @Column(name = "description", length = 150)
    private String description;

    @Column(name = "created_by", length = 30, nullable = false)
    private String createdBy;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToOne(mappedBy = "device", cascade = CascadeType.ALL)
    @JsonIgnore
    private DeviceAP deviceAP;

    @PrePersist
    public void prePersist() {
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get()
                : "SYSTEM";

        this.createdAt = Instant.now();

        if (name == null) {
            name = "Thiết Bị Smartome";
        }
        if (type == null) {
            type = DeviceType.UNKNOWN;
        }
    }
}
