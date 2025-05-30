package com.dnmanh.smartome.repository;

import com.dnmanh.smartome.entity.House;
import com.dnmanh.smartome.entity.OwnDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Repository
public interface OwnDeviceRepository extends JpaRepository<OwnDevice, Long> {
     boolean existsOwnDeviceByIdDevice(String idDevice);

     // Find ownDevice by id and ownDevice belong to user
    @Query("SELECT od FROM OwnDevice od WHERE od.id = :id AND od.house.user.id = :userId")
    OwnDevice findOwnDeviceByIdAndBelongToUser(@Param("userId") long userId, @Param("id") String id);
}
