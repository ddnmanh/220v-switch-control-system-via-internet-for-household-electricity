package com.dnmanh.smartome.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "houses")
@Getter
@Setter
public class House {
    @Id
    @Column(length = 10, nullable = false, unique = true)
    private String id;

    @Column(length = 25, nullable = false)
    private String name = "Nhà Của Tôi";

    @Column(name = "description", length = 150)
    private String description;

    @Column(name = "index_show", columnDefinition = "INT DEFAULT 2")
    private Integer indexShow = 2;

    @Column(name = "is_main_house", columnDefinition = "TINYINT DEFAULT 0")
    @ColumnDefault("false")
    private Boolean isMainHouse;

    @JsonIgnore
    private Instant createdAt;
    @JsonIgnore
    private Instant updatedAt;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @OneToOne(mappedBy = "house", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonProperty("wallpaper")
    private HouseWallpaper houseWallpaper;

    @OneToMany(mappedBy = "house", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<OwnDevice> ownDevices;

    @OneToMany(mappedBy = "house", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Room> rooms;

    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}