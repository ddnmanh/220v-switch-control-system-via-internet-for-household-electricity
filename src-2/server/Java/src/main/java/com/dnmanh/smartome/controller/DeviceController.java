package com.dnmanh.smartome.controller;

import com.dnmanh.smartome.dto.DeviceDTO;
import com.dnmanh.smartome.dto.HouseDTO;
import com.dnmanh.smartome.entity.Device;
import com.dnmanh.smartome.entity.House;
import com.dnmanh.smartome.service.DeviceService;
import com.dnmanh.smartome.service.HouseService;
import com.dnmanh.smartome.util.annotation.ApiMessage;
import com.dnmanh.smartome.util.security.SecurityUtil;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class DeviceController {

    @Autowired
    private Environment env;

    private final SecurityUtil securityUtil;
    private final DeviceService deviceService;

    public DeviceController(
        SecurityUtil sU,
        DeviceService dS
    ) {
        this.securityUtil = sU;
        this.deviceService = dS;
    }

    @PostMapping("/devices")
    @ApiMessage({"Create device is success", "Create device is fail"})
    public ResponseEntity<DeviceDTO.Res> createDevice(@RequestBody DeviceDTO.ReqCreate body) {

        Optional<Device> newDevice = this.deviceService.handleCreateDevice(body);

        if (!newDevice.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } else {
            DeviceDTO.Res resDevice = this.deviceService.convertDeviceToResDevice(newDevice.get());
            return ResponseEntity.status(HttpStatus.CREATED).body(resDevice);
        }
    }

    @GetMapping("/devices")
    @ApiMessage({"Get all devices is success", "Get all devices is fail"})
    public ResponseEntity<List<DeviceDTO.Res>> getAllDevices() {

        Optional<List<Device>> devices = this.deviceService.handleGetAllDevices();

        if (!devices.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } else {
            List<DeviceDTO.Res> resDevices = new ArrayList<>();
            for (Device device : devices.get()) {
                DeviceDTO.Res resDevice = this.deviceService.convertDeviceToResDevice(device);
                resDevices.add(resDevice);
            }
            return ResponseEntity.status(HttpStatus.OK).body(resDevices);
        }
    }

    @GetMapping("/devices/{deviceId}")
    @ApiMessage({"Get device is success", "Get device is fail"})
    public ResponseEntity<DeviceDTO.Res> getDevice(@PathVariable("deviceId") String deviceId) {

        Optional<Device> device = this.deviceService.handleGetDeviceById(deviceId);

        if (!device.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } else {
            DeviceDTO.Res resDevice = this.deviceService.convertDeviceToResDevice(device.get());

            return ResponseEntity.status(HttpStatus.OK).body(resDevice);
        }
    }

    @PutMapping("/devices")
    @ApiMessage({"Update device is success", "Update device is fail"})
    public ResponseEntity<DeviceDTO.Res> updateDevice(@RequestBody DeviceDTO.ReqUpdate body) {

        Optional<Device> updatedDevice = this.deviceService.handleUpdateDevice(body);

        if (!updatedDevice.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } else {
            DeviceDTO.Res resDevice = this.deviceService.convertDeviceToResDevice(updatedDevice.get());
            return ResponseEntity.status(HttpStatus.OK).body(resDevice);
        }
    }

    @DeleteMapping("/devices/{deviceId}")
    @ApiMessage({"Delete device is success", "Delete device is fail"})
    public ResponseEntity<Boolean> deleteDevice(@PathVariable("deviceId") String deviceId) throws BadRequestException {

        boolean isDeleted = this.deviceService.handleDeleteDevice(deviceId);

        if (!isDeleted) {
            throw new BadRequestException("Thiết bị này đã được sử dụng, không thể xóa");
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(null);
        }
    }

}
