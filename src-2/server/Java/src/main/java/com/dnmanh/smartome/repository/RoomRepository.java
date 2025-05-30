package com.dnmanh.smartome.repository;

import com.dnmanh.smartome.entity.House;
import com.dnmanh.smartome.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Repository
public interface RoomRepository extends JpaRepository<Room, String>, JpaSpecificationExecutor<Room> {


    @Query("""
        SELECT DISTINCT r FROM Room r
        RIGHT JOIN FETCH r.house h
        LEFT JOIN FETCH r.ownDevices rod
        WHERE h.user.id = :userId
            AND r.id = :roomId
    """)
    Room findRoomByIdWithRelationByIdUser(long userId, String roomId);
}
