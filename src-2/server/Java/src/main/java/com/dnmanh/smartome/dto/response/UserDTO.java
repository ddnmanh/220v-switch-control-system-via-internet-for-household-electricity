package com.dnmanh.smartome.dto.response;

import com.dnmanh.smartome.util.constant.PlatformEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class UserDTO {

    // Request to create user using User entity

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReqLoginUserDTO {
        private PlatformEnum platform;
        private String username;
        private String password;
        private float latitude;
        private float longitude;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResUserDTO {
        private long id;
        private String name;
        private String username;
        private String email;
        private RoleDTO role;
        private Instant createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoleDTO {
        private long id;
        private String name;
    }


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInsideTokenDTO {
        private long id;
        private String name;
        private String email;
        private RoleDTO role;
        // Cannot use createdAt here because jwt cannot use Instant
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResUserFullPermission {
        private long id;
        private String name;
        private String email;
        private String username;
        private RoleFullPermission role;
        private Instant createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoleFullPermission {
        private long id;
        private String name;
        private List<PermissionDTO.ResPermissionDTO> permissions;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class  ReqUserRegisterDTO {
        public String name;
        public String email;
        public String username;
        public String password;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReqVerifyOTPRegisterUserDTO {
        public String email;
        public String otp;
    }
}
