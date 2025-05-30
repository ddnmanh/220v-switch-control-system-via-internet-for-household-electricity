package com.dnmanh.smartome.controller;

import com.dnmanh.smartome.dto.HouseDTO;
import com.dnmanh.smartome.dto.RoomDTO;
import com.dnmanh.smartome.entity.House;
import com.dnmanh.smartome.entity.Room;
import com.dnmanh.smartome.service.HouseService;
import com.dnmanh.smartome.service.RoomService;
import com.dnmanh.smartome.util.annotation.ApiMessage;
import com.dnmanh.smartome.util.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class RoomController {

    @Autowired
    private Environment env;

    private final SecurityUtil securityUtil;
    private final RoomService roomService;

    public RoomController(
        SecurityUtil sU,
        RoomService rS
    ) {
        this.securityUtil = sU;
        this.roomService = rS;
    }

    @PostMapping("/rooms")
    @ApiMessage({"Create room is success", "Create room is fail"})
    public ResponseEntity<RoomDTO.ResCreate> createRoom(@RequestBody RoomDTO.ReqCreate body) {

        Long userId = SecurityUtil.getIdUserInJWT();

        RoomDTO.ReqCreate reqCreate = new RoomDTO.ReqCreate(
            userId,
            body.getIdHouse(),
            body.getName(),
            body.getDescription()
        );

        Optional<Room> newRoom = this.roomService.handleCreateRoom(reqCreate);

        if (!newRoom.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } else {

            RoomDTO.ResCreate resCreate = new RoomDTO.ResCreate(
                newRoom.get().getId(),
                newRoom.get().getName(),
                newRoom.get().getDescription()
            );

            return ResponseEntity.status(HttpStatus.OK).body(resCreate);
        }

    }

    @GetMapping("/rooms/{roomId}")
    @ApiMessage({"Get rooms is success", "Get rooms is fail"})
    public ResponseEntity<Room> getAllRooms(@PathVariable("roomId") String roomId) {

        Long userId = SecurityUtil.getIdUserInJWT();

        Optional<Room> roomById = this.roomService.handleGetRoomById(userId, roomId);

        if (!roomById.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(roomById.get());
        }

    }

    @PutMapping("/rooms")
    @ApiMessage({"Update room is success", "Update room is fail"})
    public ResponseEntity<RoomDTO.ResUpdate> updateRoom(@RequestBody RoomDTO.ReqUpdate body) {

        Long userId = SecurityUtil.getIdUserInJWT();

        RoomDTO.ReqUpdate reqUpdate = new RoomDTO.ReqUpdate(
            userId,
            body.getRoomId(),
            body.getName(),
            body.getDescription()
        );

        Optional<Room> room = this.roomService.handleUpdateRoom(reqUpdate);

        if (!room.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } else {

            RoomDTO.ResUpdate resUpdate = new RoomDTO.ResUpdate(
                room.get().getId(),
                room.get().getName(),
                room.get().getDescription()
            );

            return ResponseEntity.status(HttpStatus.OK).body(resUpdate);
        }
    }

    @DeleteMapping("/rooms/{roomId}")
    @ApiMessage({"Delete room is success", "Delete room is fail"})
    public ResponseEntity<Boolean> deleteRoom(@PathVariable("roomId") String roomId) {

        Long userId = SecurityUtil.getIdUserInJWT();

        this.roomService.handleDeleteRoom(userId, roomId);

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
