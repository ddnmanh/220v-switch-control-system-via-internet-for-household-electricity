package com.dnmanh.smartome.repository;

import com.dnmanh.smartome.entity.OperationOwnDevice;
import com.dnmanh.smartome.entity.OwnDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OperationOwnDeviceRepository extends JpaRepository<OperationOwnDevice, Long> {

    @Query("SELECT ood FROM OperationOwnDevice ood WHERE ood.idHouse = :idHouse AND ood.idDevice = :idDevice")
    void deleteOperationOwnDeviceByIdHouseAndIdDevice(String idHouse, String idDevice);

    @Query("""
        SELECT ood FROM OperationOwnDevice ood
            WHERE ood.idHouse = :idHouse
            AND ood.idDevice = :idDevice
            ORDER BY ood.eventDateTime DESC
    """)
    List<OperationOwnDevice> findOperationOwnDeviceByIdHouseAndIdDevice(String idHouse, String idDevice);
}
