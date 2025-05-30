package com.dnmanh.smartome.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = "own_device_setting")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OwnDeviceSetting {
    @Id
    @Column(name = "id_own_device", length = 10, nullable = false, unique = true)
    @JsonIgnore
    private String idOwnDevice;

    @Column(name = "is_save_state", columnDefinition = "TINYINT DEFAULT 0")
    @ColumnDefault("false")
    private Boolean isSaveState;

    @Column(name = "is_reset_confirm", columnDefinition = "TINYINT DEFAULT 0")
    @ColumnDefault("false")
    private Boolean isResetConfirm;

    @OneToOne
    @JoinColumn(name = "id_own_device", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private OwnDevice ownDevice;

    @PrePersist
    public void prePersist() {
        if (isSaveState == null) {
            isSaveState = false;
        }
        if (isResetConfirm == null) {
            isResetConfirm = false;
        }
    }

}