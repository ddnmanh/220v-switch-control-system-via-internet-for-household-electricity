package com.dnmanh.smartome.service;

import com.dnmanh.smartome.dto.HouseDTO;
import com.dnmanh.smartome.dto.exception.InvalidFieldDTO;
import com.dnmanh.smartome.dto.response.PermissionDTO;
import com.dnmanh.smartome.dto.response.ResPaginationDTO;
import com.dnmanh.smartome.dto.response.UserDTO;
import com.dnmanh.smartome.entity.*;
import com.dnmanh.smartome.repository.*;
import com.dnmanh.smartome.util.GenerateUuidUtil;
import com.dnmanh.smartome.util.constant.TypeAlphabet;
import com.dnmanh.smartome.util.error.FieldsException;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class HouseService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    @Autowired
    private Environment env;
    private final HouseRepository houseRepository;
    private final UserRepository userRepository;
    private final RoomService roomService;
    private final GenerateUuidUtil generateUuidUtil;

    public HouseService(
        HouseRepository hR,
        UserRepository uR,
        RoomService rS,
        GenerateUuidUtil gUU
    ) {
        this.houseRepository = hR;
        this.userRepository = uR;
        this.roomService = rS;
        this.generateUuidUtil = gUU;
    }

    public Optional<House> handleCreateHouse(HouseDTO.ReqCreate body) {
        validateCreateHouseInput(body);

        if (Boolean.TRUE.equals(body.getIsMainHouse())) {
            // Set all other houses of this user to not be the main house
            this.houseRepository.setAllHouseIsNotMain(body.getUserId());
        }

        User user = this.userRepository.findById(body.getUserId())
                .orElseThrow(
                        () -> new FieldsException(
                            Collections.singletonList(
                                new InvalidFieldDTO("user_id", "User not found")
                            )
                        )
                );

        House house = buildHouseFromDTO(body, user);

        return Optional.ofNullable(this.houseRepository.save(house));
    }

    public Optional<List<House>> handleGetHouses(Long userId) {
        List<House> houses = this.houseRepository.findAllHouseWithRelationByIdUser(userId);

        // Xử lý xóa các ownDevice thuộc house.ownDevices nếu như ownDevice đó thuộc room
        houses.forEach(house -> {
            house.getRooms().forEach(room -> {
                room.getOwnDevices().forEach(ownDevice -> {
                    if (house.getOwnDevices().contains(ownDevice)) {
                        house.getOwnDevices().remove(ownDevice);
                    }
                });
            });
        });

        return Optional.ofNullable(houses);
    }

    public Optional<House> handleGetHouseById(Long userId, String houseId) {
        House house = this.houseRepository.findHouseByIdWithRelationByIdUser(userId, houseId);

        // Xử lý xóa các ownDevice thuộc house.ownDevices nếu như ownDevice đó thuộc room
        if (house != null) {
            house.getRooms().forEach(room -> {
                room.getOwnDevices().forEach(ownDevice -> {
                    if (house.getOwnDevices().contains(ownDevice)) {
                        house.getOwnDevices().remove(ownDevice);
                    }
                });
            });
        }

        return Optional.ofNullable(house);
    }

    public Optional<House> handleUpdateHouse(HouseDTO.ReqUpdate body) {
        validateUpdateHouseInput(body);

        House house = this.houseRepository.findHouseByIdWithRelationByIdUser(body.getUserId(), body.getHouseId());
        if (house == null) {
            throw new FieldsException(
                    Collections.singletonList(
                        new InvalidFieldDTO("house_id", "Không tim thấy nhà này")
                    )
            );
        }

        if (Boolean.TRUE.equals(body.getIsMainHouse())) {
            // Set all other houses of this user to not be the main house
            this.houseRepository.setAllHouseIsNotMain(body.getUserId());
        }

        House houseUpdate = house;

        houseUpdate.setName(body.getName());
        houseUpdate.setDescription(body.getDescription());
        houseUpdate.setIsMainHouse(body.getIsMainHouse());
        HouseWallpaper houseWallpaper = houseUpdate.getHouseWallpaper();
        houseWallpaper.setIsBlur(body.getWallpaperBlur());
        houseUpdate.setHouseWallpaper(houseWallpaper);

        return Optional.ofNullable(this.houseRepository.save(houseUpdate));
    }

    public void handleDeleteHouse(Long userId, String houseId) {
        House house = this.houseRepository.findHouseByIdWithRelationByIdUser(userId, houseId);

        if (house == null) {
            throw new FieldsException(
                    Collections.singletonList(
                        new InvalidFieldDTO("house_id", "Nhà này không tồn tại hoặc không thuộc về bạn")
                    )
            );
        }

        // Xóa các ownDevice thuộc house.ownDevices nếu như ownDevice đó thuộc room
        house.getRooms().forEach(room -> {
            room.getOwnDevices().forEach(ownDevice -> {
                this.roomService.handleDeleteRoom(userId, ownDevice.getId());
            });
        });

        this.houseRepository.delete(house);
    }


    // --------------------------------------------------

    // Validate input of house for creat house
    private void validateCreateHouseInput(HouseDTO.ReqCreate body) {
        List<InvalidFieldDTO> invalidFields = new ArrayList<>();

        if (body.getName() == null || body.getName().trim().isEmpty()) {
            invalidFields.add(new InvalidFieldDTO("name", "Name must not be empty"));
        }

        if (body.getDescription() != null && body.getDescription().trim().length() > 150) {
            invalidFields.add(new InvalidFieldDTO("description", "Description must be less than 150 characters"));
        }

        if (!invalidFields.isEmpty()) {
            throw new FieldsException(invalidFields);
        }
    }

    // Build house from DTO for create house
    private House buildHouseFromDTO(HouseDTO.ReqCreate body, User user) {
        String houseId = this.generateUuidUtil.generateId(10, TypeAlphabet.SECURITY);

        House house = new House();
        house.setId(houseId);
        house.setName(body.getName());
        house.setDescription(body.getDescription());
        house.setIsMainHouse(body.getIsMainHouse());
        house.setUser(user);

        HouseWallpaper houseWallpaper = new HouseWallpaper();
        houseWallpaper.setIdHouse(houseId);
        houseWallpaper.setHouse(house);
        houseWallpaper.setIsBlur(body.getWallpaperBlur());

        house.setHouseWallpaper(houseWallpaper);

        return house;
    }

    // Validate input of house for creat house
    private void validateUpdateHouseInput(HouseDTO.ReqUpdate body) {
        List<InvalidFieldDTO> invalidFields = new ArrayList<>();

        if (body.getName() == null || body.getName().trim().isEmpty()) {
            invalidFields.add(new InvalidFieldDTO("name", "Name must not be empty"));
        }

        if (body.getDescription() != null && body.getDescription().trim().length() > 150) {
            invalidFields.add(new InvalidFieldDTO("description", "Description must be less than 150 characters"));
        }

        if (!invalidFields.isEmpty()) {
            throw new FieldsException(invalidFields);
        }
    }
}
