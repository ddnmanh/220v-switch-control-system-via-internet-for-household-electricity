package com.dnmanh.smartome.controller;

import com.dnmanh.smartome.dto.HouseDTO;
import com.dnmanh.smartome.entity.User;
import com.dnmanh.smartome.entity.UserRegister;
import com.dnmanh.smartome.dto.response.UserDTO;
import com.dnmanh.smartome.service.GeneralService;
import com.dnmanh.smartome.service.HouseService;
import com.dnmanh.smartome.util.GenerateUuidUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dnmanh.smartome.service.UserService;
import com.dnmanh.smartome.util.annotation.ApiMessage;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    private Environment env;

    private final GenerateUuidUtil generateUUIDService;
    private  final GeneralService generalService;
    private final UserService userService;
    private final HouseService houseService;

    public UserController(
            GenerateUuidUtil generateUUIDService,
            GeneralService generalService,
            UserService userService,
            HouseService houseService
    ) {
        this.generateUUIDService = generateUUIDService;
        this.generalService = generalService;
        this.userService = userService;
        this.houseService = houseService;
    }

    @PostMapping("/users/register/resend-verify-otp")
    @ApiMessage({"Resend verify OTP is success", "Resend verify OTP is fail"})
    public ResponseEntity<Boolean> resendVerifyOTP(@RequestBody UserDTO.ReqVerifyOTPRegisterUserDTO body) {
        this.userService.resendOtpUserRegister(body.email);
        return ResponseEntity.status(HttpStatus.OK).body(true);
    }

    @PostMapping("/users/register/verify-otp")
    @ApiMessage({"Verify OTP is success", "Verify OTP is fail"})
    public ResponseEntity<Boolean> verifyOTP(@RequestBody UserDTO.ReqVerifyOTPRegisterUserDTO body) {
        if (this.userService.verifyOtpUserRegister(body)) {

            Optional<User> newUser = this.userService.handleCreateUserFromUserRegister(body.email);

            if (!newUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
            } else {
                // Tạo nhà mặc định cho user mới
                HouseDTO.ReqCreate createHouseDTO = new HouseDTO.ReqCreate();
                createHouseDTO.setUserId(newUser.get().getId());
                createHouseDTO.setName("Nhà Của Tôi");
                createHouseDTO.setDescription("Được tạo mặc định");
                createHouseDTO.setIsMainHouse(true);

                this.houseService.handleCreateHouse(createHouseDTO);

                return ResponseEntity.status(HttpStatus.OK).body(true);
            }

        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
        }

    }

    @PostMapping("/users/register")
    @ApiMessage({"Register a new user is success", "Register a new user is failed"})
    public ResponseEntity<Boolean> registerNewUser(@RequestBody UserDTO.ReqUserRegisterDTO reqUserRegister) {

        UserRegister userRegister = this.userService.handleUserRegiter(reqUserRegister);

        if (userRegister != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(true);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
        }
    }

}
