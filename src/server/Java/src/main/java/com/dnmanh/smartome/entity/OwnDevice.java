package com.dnmanh.smartome.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Entity
@Table(name = "own_device")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OwnDevice {

    @Id
    @Column(name = "id", length = 10, nullable = false, unique = true)
    private String id;

    @Column(name = "id_device", length = 10, nullable = false)
    @JsonIgnore
    private String idDevice;

    @Column(name = "id_house", length = 10, nullable = false)
    @JsonIgnore
    private String idHouse;

    @Column(name = "id_room", length = 10)
    @JsonIgnore
    private String idRoom;

    @Column(length = 25, nullable = false)
    private String name;

    @Column(name = "description", length = 150)
    private String description;

    @Column(name = "topic_send", length = 30, nullable = false)
    private String topicSend;

    @Column(name = "topic_receive", length = 30, nullable = false)
    private String topicReceive;

    @Column(name = "created_at")
    @JsonIgnore
    private Instant createdAt;

    @Column(name = "updated_at")
    @JsonIgnore
    private Instant updatedAt;

    @ManyToOne
    @JoinColumn(name = "id_house", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private House house;

    @ManyToOne
    @JoinColumn(name = "id_room", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private Room room;

    @OneToOne
    @JoinColumn(name = "id_device", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private Device device;

    @OneToOne(mappedBy = "ownDevice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonProperty("setting")
    private OwnDeviceSetting ownDeviceSetting;

    @PrePersist
    public void prePersist() {
        if (this.topicSend == null) {
            this.topicSend = this.house.getId() + "/" + this.device.getId() + "receive";
        }
        if (this.topicReceive == null) {
            this.topicSend = this.house.getId() + "/" + this.device.getId() + "/send";
        }

        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}