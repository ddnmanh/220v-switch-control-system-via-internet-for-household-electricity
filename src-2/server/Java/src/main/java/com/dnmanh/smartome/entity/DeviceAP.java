package com.dnmanh.smartome.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "device_AP")
@Getter
@Setter
@NoArgsConstructor
public class DeviceAP {
    @Id
    @Column(name = "id_device", length = 6, nullable = false, unique = true)
    @JsonIgnore
    private String idDevice;

    @Column(name = "ap_ssid", length = 30, nullable = false)
    private String apSsid;

    @Column(name = "ap_password", length = 10, nullable = false)
    private String apPassword;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_device")
    @JsonIgnore
    private Device device;

    @PrePersist
    public void prePersist() {
        if (apPassword == null) {
            apPassword = "123456789";
        }
        if (apSsid == null) {
            apSsid = "DEVICE_99999";
        }
    }
}