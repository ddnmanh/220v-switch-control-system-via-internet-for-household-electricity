package com.dnmanh.smartome.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "rooms")
@Getter
@Setter
public class Room {
    @Id
    @Column(length = 10, nullable = false, unique = true)
    private String id;

    @Column(name = "id_house", length = 10, nullable = false)
    @JsonIgnore
    private String idHouse;

    @Column(length = 30, nullable = false)
    private String name;

    @Column(name = "description", length = 150)
    private String description;

    @ManyToOne
    @JoinColumn(name = "id_house", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private House house;


    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<OwnDevice> ownDevices;

}