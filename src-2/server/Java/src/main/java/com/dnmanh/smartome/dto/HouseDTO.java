package com.dnmanh.smartome.dto;

import com.dnmanh.smartome.dto.response.PermissionDTO;
import com.dnmanh.smartome.util.constant.PlatformEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class HouseDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReqCreate {
        private long userId;
        private String name;
        private String description;
        private Boolean wallpaperBlur;
        private Boolean isMainHouse;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReqUpdate {
        private long userId;
        private String houseId;
        private String name;
        private String description;
        private Boolean wallpaperBlur;
        private Boolean isMainHouse;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResUpdate {
        private String id;
        private String name;
        private String description;
        private Integer indexShow;
        private Boolean isMainHouse;
        private ResHouseWallpaper houseWallpaper;
        private Instant created_at;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResHouseWallpaper {
        private long id;
        private String path;
        private Boolean isBlur;
    }
}
