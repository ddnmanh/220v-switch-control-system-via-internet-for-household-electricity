package com.dnmanh.smartome.service;

import com.dnmanh.smartome.dto.HouseDTO;
import com.dnmanh.smartome.dto.RoomDTO;
import com.dnmanh.smartome.dto.exception.InvalidFieldDTO;
import com.dnmanh.smartome.entity.House;
import com.dnmanh.smartome.entity.HouseWallpaper;
import com.dnmanh.smartome.entity.Room;
import com.dnmanh.smartome.entity.User;
import com.dnmanh.smartome.repository.HouseRepository;
import com.dnmanh.smartome.repository.RoomRepository;
import com.dnmanh.smartome.repository.UserRepository;
import com.dnmanh.smartome.util.GenerateUuidUtil;
import com.dnmanh.smartome.util.constant.TypeAlphabet;
import com.dnmanh.smartome.util.error.FieldsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class RoomService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    @Autowired
    private Environment env;
    private final HouseRepository houseRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final OwnDeviceService ownDeviceService;
    private final GenerateUuidUtil generateUuidUtil;

    public RoomService(
        HouseRepository hR,
        RoomRepository rR,
        UserRepository uR,
        OwnDeviceService oDS,
        GenerateUuidUtil gUU
    ) {
        this.houseRepository = hR;
        this.roomRepository = rR;
        this.userRepository = uR;
        this.ownDeviceService = oDS;
        this.generateUuidUtil = gUU;
    }

    public Optional<Room> handleCreateRoom(RoomDTO.ReqCreate body) {
        validateCreateRoomInput(body);

        House house = this.houseRepository.findHouseByIdWithRelationByIdUser(body.getIdUser(), body.getIdHouse());

        if (house == null) {
            throw new FieldsException(
                Collections.singletonList(
                    new InvalidFieldDTO("house_id", "Nhà đã bị xóa hoặc không thuộc về bạn")
                )
            );
        }

        Room room = new Room();
        room.setId(this.generateUuidUtil.generateId(10, TypeAlphabet.SECURITY));
        room.setIdHouse(body.getIdHouse());
        room.setName(body.getName());
        room.setDescription(body.getDescription());
        room.setHouse(house);

        return Optional.ofNullable(this.roomRepository.save(room));

    }

    public Optional<Room> handleGetRoomById(Long idUser, String idRoom) {
        Room room = this.roomRepository.findRoomByIdWithRelationByIdUser(idUser, idRoom);

        if (room == null) {
            throw new FieldsException(
                Collections.singletonList(
                    new InvalidFieldDTO("room_id", "Phòng không tồn tại hoặc không thuộc về bạn")
                )
            );
        }

        return Optional.ofNullable(room);
    }

    public Optional<Room> handleUpdateRoom(RoomDTO.ReqUpdate body) {
        validateUpdateRoomInput(body);

        Room room = this.roomRepository.findById(body.getRoomId()).orElse(null);

        if (room == null) {
            throw new FieldsException(
                Collections.singletonList(
                    new InvalidFieldDTO("room_id", "Phòng không tồn tại hoặc đã bị xóa")
                )
            );
        }

        room.setName(body.getName());
        room.setDescription(body.getDescription());

        return Optional.ofNullable(this.roomRepository.save(room));
    }


    public void handleDeleteRoom(Long idUser, String idRoom) {
        Room room = this.roomRepository.findRoomByIdWithRelationByIdUser(idUser, idRoom);

        if (room == null) {
            throw new FieldsException(
                Collections.singletonList(
                    new InvalidFieldDTO("room_id", "Phòng không tồn tại hoặc không thuộc về bạn")
                )
            );
        }

        // Xóa
        room.getOwnDevices().forEach(ownDevice -> {
            try {
                this.ownDeviceService.handleDeleteOwnDevice(idUser, ownDevice.getId());
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        this.roomRepository.delete(room);
    }

    // --------------------------------------------------

    // Validate input of room for creat room
    private void validateCreateRoomInput(RoomDTO.ReqCreate body) {
        List<InvalidFieldDTO> invalidFields = new ArrayList<>();

        if (body.getName() == null || body.getName().trim().isEmpty()) {
            invalidFields.add(new InvalidFieldDTO("name", "Name must not be empty"));
        } else if (body.getName().trim().length() > 30) {
            invalidFields.add(new InvalidFieldDTO("name", "Name must less than 30 characters"));
        }

        if (body.getDescription() != null && body.getDescription().trim().length() > 150) {
            invalidFields.add(new InvalidFieldDTO("description", "Description must be less than 150 characters"));
        }

        if (!invalidFields.isEmpty()) {
            throw new FieldsException(invalidFields);
        }
    }

    // Validate input of house for creat house
    private void validateUpdateRoomInput(RoomDTO.ReqUpdate body) {
        List<InvalidFieldDTO> invalidFields = new ArrayList<>();

        if (body.getName() == null || body.getName().trim().isEmpty()) {
            invalidFields.add(new InvalidFieldDTO("name", "Name must not be empty"));
        } else if (body.getName().trim().length() > 30) {
            invalidFields.add(new InvalidFieldDTO("name", "Name must less than 30 characters"));
        }

        if (body.getDescription() != null && body.getDescription().trim().length() > 150) {
            invalidFields.add(new InvalidFieldDTO("description", "Description must be less than 150 characters"));
        }

        if (!invalidFields.isEmpty()) {
            throw new FieldsException(invalidFields);
        }
    }
}
