package com.dnmanh.smartome.controller;

import com.dnmanh.smartome.dto.DeviceDTO;
import com.dnmanh.smartome.dto.OperationOwnDeviceDTO;
import com.dnmanh.smartome.dto.OwnDeviceDTO;
import com.dnmanh.smartome.entity.Device;
import com.dnmanh.smartome.entity.OperationOwnDevice;
import com.dnmanh.smartome.entity.OwnDevice;
import com.dnmanh.smartome.service.DeviceService;
import com.dnmanh.smartome.service.OwnDeviceService;
import com.dnmanh.smartome.util.annotation.ApiMessage;
import com.dnmanh.smartome.util.security.SecurityUtil;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class OwnDeviceController {

    @Autowired
    private Environment env;

    private final SecurityUtil securityUtil;
    private final OwnDeviceService ownDeviceService;

    public OwnDeviceController(
        SecurityUtil sU,
        OwnDeviceService oDS
    ) {
        this.securityUtil = sU;
        this.ownDeviceService = oDS;
    }

    @PostMapping("/own-devices")
    @ApiMessage({"Add own device is success", "Add own device is fail"})
    public ResponseEntity<OwnDeviceDTO.Res> addOwnDevice(@RequestBody OwnDeviceDTO.ReqCreate body) {
        Long userId = this.securityUtil.getIdUserInJWT();

        body.setIdUser(userId);

        Optional<OwnDevice> newOwnDevice = this.ownDeviceService.handleCreateOwnDevice(body);

        if (!newOwnDevice.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } else {
            OwnDeviceDTO.Res res = this.ownDeviceService.convertOwnDevicetoOwnDeviceRes(newOwnDevice.get());

            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        }
    }

    @GetMapping("/own-devices/{ownDeviceId}")
    @ApiMessage({"Get own device is success", "Get own device is fail"})
    public ResponseEntity<OwnDeviceDTO.Res> getOwnDevice(@PathVariable("ownDeviceId") String ownDeviceId) {
        Long userId = this.securityUtil.getIdUserInJWT();

        Optional<OwnDevice> ownDevice = this.ownDeviceService.handleGetOwnDeviceById(userId, ownDeviceId);

        if (!ownDevice.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } else {
            OwnDeviceDTO.Res res = this.ownDeviceService.convertOwnDevicetoOwnDeviceRes(ownDevice.get());

            return ResponseEntity.status(HttpStatus.OK).body(res);
        }
    }

    @PutMapping("/own-devices")
    @ApiMessage({"Update own device is success", "Update own device is fail"})
    public ResponseEntity<OwnDeviceDTO.Res> updateOwnDevice(@RequestBody OwnDeviceDTO.ReqUpdate body) {
        Long userId = this.securityUtil.getIdUserInJWT();

        body.setIdUser(userId);

        Optional<OwnDevice> updatedOwnDevice = this.ownDeviceService.handleUpdateOwnDevice(body);

        if (!updatedOwnDevice.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } else {
            OwnDeviceDTO.Res res = this.ownDeviceService.convertOwnDevicetoOwnDeviceRes(updatedOwnDevice.get());

            return ResponseEntity.status(HttpStatus.OK).body(res);
        }
    }

    @DeleteMapping("/own-devices/{ownDeviceId}")
    @ApiMessage({"Delete own device is success", "Delete own device is fail"})
    public ResponseEntity<Boolean> deleteOwnDevice(@PathVariable("ownDeviceId") String ownDeviceId) {
        Long userId = this.securityUtil.getIdUserInJWT();

        this.ownDeviceService.handleDeleteOwnDevice(userId, ownDeviceId);

        return ResponseEntity.status(HttpStatus.OK).body(null);
 
    }

    @GetMapping("/own-devices/operations/{ownDeviceId}")
    @ApiMessage({"Get operation of own device is success", "Get operation of own device is fail"})
    public ResponseEntity<List<OperationOwnDevice>> getOperationOwnDevice(@PathVariable("ownDeviceId") String ownDeviceId) {
        Long userId = this.securityUtil.getIdUserInJWT();

        Optional<List<OperationOwnDevice>> operationOwnDevices = this.ownDeviceService.handleGetOperationOwnDevice(userId, ownDeviceId);


        return ResponseEntity.status(HttpStatus.OK).body(operationOwnDevices.get());
    }

    @PutMapping("/own-devices/setting")
    @ApiMessage({"Update setting of own device is success", "Update setting of own device is fail"})
    public ResponseEntity<OwnDeviceDTO.Res> updateSettingOwnDevice(@RequestBody OwnDeviceDTO.ReqUpdateSetting body) {
        Long userId = this.securityUtil.getIdUserInJWT();

        body.setIdUser(userId);

        Optional<OwnDevice> updatedOwnDeviceSetting = this.ownDeviceService.handleUpdateOwnDeviceSetting(body);

        if (!updatedOwnDeviceSetting.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } else {
            OwnDeviceDTO.Res res = this.ownDeviceService.convertOwnDevicetoOwnDeviceRes(updatedOwnDeviceSetting.get());

            return ResponseEntity.status(HttpStatus.OK).body(res);
        }
    }
}
