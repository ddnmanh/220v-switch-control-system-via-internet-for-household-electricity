package com.dnmanh.smartome.repository;

import com.dnmanh.smartome.entity.House;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;

@Repository
public interface HouseRepository extends JpaRepository<House, Long>, JpaSpecificationExecutor<House> {

    @Modifying
    @Transactional
    @Query("UPDATE House h SET h.isMainHouse = false WHERE h.user.id = :userId")
    void setAllHouseIsNotMain(long userId);

    @Query("SELECT h FROM House h WHERE h.user.id = :userId")
    ArrayList<House> findAllByUserId(long userId);

    // OwnDevice thuộc room đều được truy vấn đưa lên house.ownDevice và cả ở trong house.rooms.ownDevices
    // Cho nên phải xóa bỏ các ownDevice thuộc house.ownerDevices nếu như ownDevice đó thuộc room
    // Tóm lại ownDevice thuộc room không thể thuộc house.ownDevices
    @Query("""
        SELECT DISTINCT h FROM House h
        LEFT JOIN FETCH h.rooms r
        LEFT JOIN FETCH r.ownDevices rod
        LEFT JOIN FETCH h.ownDevices hod
        LEFT JOIN FETCH h.houseWallpaper hw
        LEFT JOIN FETCH rod.ownDeviceSetting rods
        LEFT JOIN FETCH hod.ownDeviceSetting hods
        WHERE h.user.id = :userId
    """)
    ArrayList<House> findAllHouseWithRelationByIdUser(@Param("userId") long userId);


    // OwnDevice thuộc room đều được truy vấn đưa lên house.ownDevice và cả ở trong house.rooms.ownDevices
    // Cho nên phải xóa bỏ các ownDevice thuộc house.ownerDevices nếu như ownDevice đó thuộc room
    // Tóm lại ownDevice thuộc room không thể thuộc house.ownDevices
    @Query("""
        SELECT DISTINCT h FROM House h
        LEFT JOIN FETCH h.rooms r
        LEFT JOIN FETCH r.ownDevices rod
        LEFT JOIN FETCH h.ownDevices hod
        LEFT JOIN FETCH h.houseWallpaper hw
        LEFT JOIN FETCH rod.ownDeviceSetting rods
        LEFT JOIN FETCH hod.ownDeviceSetting hods
        WHERE h.user.id = :userId
            AND h.id = :houseId
    """)
    House findHouseByIdWithRelationByIdUser(@Param("userId") long userId, @Param("houseId") String houseId);

}
