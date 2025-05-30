package com.dnmanh.smartome.controller;

import com.dnmanh.smartome.dto.HouseDTO;
import com.dnmanh.smartome.entity.House;
import com.dnmanh.smartome.service.HouseService;
import com.dnmanh.smartome.util.annotation.ApiMessage;
import com.dnmanh.smartome.util.security.SecurityUtil;
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
public class HouseController {

    @Autowired
    private Environment env;

    private final SecurityUtil securityUtil;
    private final HouseService houseService;

    public HouseController(
        SecurityUtil sU,
        HouseService hS
    ) {
        this.securityUtil = sU;
        this.houseService = hS;
    }

    @PostMapping("/houses")
    @ApiMessage({"Create house is success", "Create house is fail"})
    public ResponseEntity<House> createHouse(@RequestBody HouseDTO.ReqCreate body) {
        Long userId = SecurityUtil.getIdUserInJWT();

        HouseDTO.ReqCreate reqCreate = new HouseDTO.ReqCreate(
            userId,
            body.getName(),
            body.getDescription(),
            body.getWallpaperBlur(),
            body.getIsMainHouse()
        );

        Optional<House> newHouse = this.houseService.handleCreateHouse(reqCreate);

        if (!newHouse.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(newHouse.get());
        }

    }

    @GetMapping("/houses")
    @ApiMessage({"Get houses is success", "Get houses is fail"})
    public ResponseEntity<List<House>> getHouses() {

        Long userId = SecurityUtil.getIdUserInJWT();

        Optional<List<House>> houses = this.houseService.handleGetHouses(userId);

        return ResponseEntity.status(HttpStatus.OK).body(houses.get());
    }

    @GetMapping("/houses/{houseId}")
    @ApiMessage({"Get house by id is success", "Get house by id is fail"})
    public ResponseEntity<House> getHouseById(@PathVariable("houseId") String houseId) {

        Long userId = SecurityUtil.getIdUserInJWT();

        Optional<House> house = this.houseService.handleGetHouseById(userId, houseId);

        if (!house.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(house.get());
        }
    }

    @PutMapping("/houses")
    @ApiMessage({"Update house is success", "Update house is fail"})
    public ResponseEntity<HouseDTO.ResUpdate> updateHouse(@RequestBody HouseDTO.ReqUpdate body) {

        body.setUserId(SecurityUtil.getIdUserInJWT());

        Optional<House> house = this.houseService.handleUpdateHouse(body);

        if (!house.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {

            HouseDTO.ResUpdate houseRes = new HouseDTO.ResUpdate(
                house.get().getId(),
                house.get().getName(),
                house.get().getDescription(),
                house.get().getIndexShow(),
                house.get().getIsMainHouse(),
                new HouseDTO.ResHouseWallpaper(
                    house.get().getHouseWallpaper().getId(),
                    house.get().getHouseWallpaper().getPath(),
                    house.get().getHouseWallpaper().getIsBlur()
                ),
                house.get().getCreatedAt()
            );

            return ResponseEntity.status(HttpStatus.OK).body(houseRes);
        }
    }

    @DeleteMapping("/houses/{houseId}")
    @ApiMessage({"Delete house is success", "Delete house is fail"})
    public ResponseEntity<Boolean> deleteHouse(@PathVariable("houseId") String houseId) {

        Long userId = SecurityUtil.getIdUserInJWT();

        this.houseService.handleDeleteHouse(userId, houseId);

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
