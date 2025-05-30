package com.dnmanh.smartome.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;



@Entity
@Table(name = "operation_own_device")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OperationOwnDevice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "id_device", length = 10, nullable = false)
    private String idDevice;

    @Column(name = "id_house", length = 10, nullable = false)
    private String idHouse;

    @Column(name = "state", length = 10, columnDefinition = "TINYINT DEFAULT 0")
    private Boolean state;

    @Column(name = "event_date_time")
    private Instant eventDateTime;

    @PrePersist
    public void prePersist() {
        this.eventDateTime = Instant.now();
    }
}