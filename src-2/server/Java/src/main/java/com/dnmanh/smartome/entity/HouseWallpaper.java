package com.dnmanh.smartome.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;


@Entity
@Table(name = "house_wallpaper")
@Getter
@Setter
@NoArgsConstructor
public class HouseWallpaper {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_house", length = 10, nullable = false)
    @JsonIgnore
    private String idHouse;

    @Column(name = "path", length = 3000)
    private String path;

    @Column(name = "is_blur")
    @ColumnDefault("false")
    private Boolean isBlur;

    @Column(name = "is_select")
    @ColumnDefault("false")
    private Boolean isSelect;

    @ManyToOne
    @JoinColumn(name = "id_house", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private House house;

    @PrePersist
    public void prePersist() {
        if (isSelect == null) {
            isSelect = false;
        }
        if (isBlur == null) {
            isBlur = true;
        }
    }
}