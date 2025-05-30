package com.dnmanh.smartome.controller;

import com.dnmanh.smartome.dto.response.ResLoginDTO;
import com.dnmanh.smartome.dto.response.UserDTO;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.dnmanh.smartome.entity.User;
import com.dnmanh.smartome.service.UserService;
import com.dnmanh.smartome.util.security.SecurityUtil;
import com.dnmanh.smartome.util.annotation.ApiMessage;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class AuthController {

    @Autowired
    private Environment env;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
        AuthenticationManagerBuilder authenticationManagerBuilder,
        SecurityUtil securityUtil,
        UserService userService,
        PasswordEncoder passwordEncoder
    ) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/auth/log-in")
    @ApiMessage("Login success")
    public ResponseEntity<ResLoginDTO> login(@RequestBody UserDTO.ReqLoginUserDTO loginDto) {
        // Nạp input gồm username/password vào Security
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword());

        // xác thực người dùng => cần viết hàm loadUserByUsername
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // set thông tin người dùng đăng nhập vào context (có thể sử dụng sau này)
        SecurityContextHolder.getContext().setAuthentication(authentication);

        ResLoginDTO res = new ResLoginDTO();

        User userIsValid = this.userService.handleGetUserByUsername(loginDto.getUsername());

        if (userIsValid != null) {

            UserDTO.RoleDTO role = new UserDTO.RoleDTO(
                userIsValid.getRole().getId(),
                userIsValid.getRole().getName()
            );

            UserDTO.ResUserDTO userLogin = new UserDTO.ResUserDTO(
                userIsValid.getId(),
                userIsValid.getName(),
                userIsValid.getUsername(),
                userIsValid.getEmail(),
                role,
                userIsValid.getCreatedAt()
            );

            // create access token
            String access_token = this.securityUtil.createAccessToken(loginDto.getUsername(), userLogin);
            ResLoginDTO.TokenDTO accessTokenDTO = new ResLoginDTO.TokenDTO();
            accessTokenDTO.setToken(access_token);
            accessTokenDTO.setLifeTime(Integer.valueOf(this.env.getProperty("env.jwtaccess-token-exprires-sec")));
            res.setAccessToken(accessTokenDTO);

            // create refresh token
            String refresh_token = this.securityUtil.createRefreshToken(loginDto.getUsername(), userLogin);
            ResLoginDTO.TokenDTO refreshTokenDTO = new ResLoginDTO.TokenDTO();
            refreshTokenDTO.setToken(refresh_token);
            refreshTokenDTO.setLifeTime(Integer.valueOf(this.env.getProperty("env.jwtrefresh-token-exprires-sec")));
            res.setRefreshToken(refreshTokenDTO);

            // Ghi lại refresh token vào DB
            this.userService.handleUserNewLogIn(userIsValid, refresh_token);

            switch (loginDto.getPlatform()) {
                case WEB:
                    // set cookies
                    ResponseCookie resCookies = ResponseCookie
                        .from(this.env.getProperty("env.name-cookie-jwt"), refresh_token)
                        .httpOnly(true)
                        .secure(true)
                        .path("/")
                        .maxAge(Integer.valueOf(this.env.getProperty("env.jwtrefresh-token-exprires-sec")))
                        .build();

                    return ResponseEntity.status(HttpStatus.OK)
                        .header(HttpHeaders.SET_COOKIE, resCookies.toString())
                        .body(res);
            }

            return ResponseEntity.status(HttpStatus.OK).body(res);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
    }

    @GetMapping("/auth/user-info")
    @ApiMessage("Get user info is successful")
    public ResponseEntity<UserDTO.ResUserFullPermission> getAccount() throws Exception {

        String username = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";

        if (username.isEmpty()) {
            throw new BadRequestException("Error when get user");
        }

        User currentUserDB = this.userService.handleGetUserByUsername(username);

        return ResponseEntity.status(HttpStatus.OK).body(this.userService.convertUserToResUserFullPermissions(currentUserDB));
    }

    @GetMapping("/auth/renew-access-token")
    @ApiMessage("Renew access token")
    public ResponseEntity<ResLoginDTO> getRefreshToken(@RequestHeader("Authorization") String bearer) throws Exception {

        String refreshToken = bearer.substring(7); // Cắt bỏ phần "Bearer " để lấy token

        // check valid
        Jwt decodedToken = this.securityUtil.checkValidRefreshToken(refreshToken);

        String username = decodedToken.getSubject();

        // check user by token + email
        Optional<User> userIsValidOptional = this.userService.getUserByRefreshTokenAndUsername(refreshToken, username);

        ResLoginDTO res = new ResLoginDTO();

        if (userIsValidOptional.isPresent()) {

            User userIsValid = userIsValidOptional.get();

            UserDTO.RoleDTO role = new UserDTO.RoleDTO(
                userIsValid.getRole().getId(),
                userIsValid.getRole().getName()
            );

            UserDTO.ResUserDTO userLogin = new UserDTO.ResUserDTO(
                userIsValid.getId(),
                userIsValid.getName(),
                userIsValid.getUsername(),
                userIsValid.getEmail(),
                role,
                userIsValid.getCreatedAt()
            );


            // create access token
            String access_token = this.securityUtil.createAccessToken(userIsValid.getUsername(), userLogin);
            ResLoginDTO.TokenDTO accessTokenDTO = new ResLoginDTO.TokenDTO();
            accessTokenDTO.setToken(access_token);
            accessTokenDTO.setLifeTime(Integer.valueOf(this.env.getProperty("env.jwtaccess-token-exprires-sec")));
            res.setAccessToken(accessTokenDTO);

            return ResponseEntity.ok().body(res);

        } else {
            throw new BadRequestException("Invalid refresh token");
        }

    }

    @PostMapping("/auth/log-out")
    @ApiMessage("Logout User")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String bearer) throws Exception {

        String refreshToken = bearer.substring(7); // Cắt bỏ phần "Bearer " để lấy token

        // check valid
        Jwt decodedToken = this.securityUtil.checkValidRefreshToken(refreshToken);

        this.userService.handleDeleteUserLogIn(decodedToken.getSubject());

        // remove refresh token cookie
        ResponseCookie deleteSpringCookie = ResponseCookie
            .from(this.env.getProperty("env.name-cookie-jwt"), null)
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(0)
            .build();

        return ResponseEntity.status(HttpStatus.OK)
            .header(HttpHeaders.SET_COOKIE, deleteSpringCookie.toString())
            .body(null);
    }

}
