package com.dnmanh.smartome.dto;

import com.dnmanh.smartome.util.constant.DeviceType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class DeviceDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReqCreate {
        private String name;
        private String description;
        private DeviceType type;
        private String apPassword;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Res {
        private String id;
        private String name;
        private String description;
        private DeviceType type;
        private ResDeviceAP deviceAP;
        private String createdBy;
        private Instant createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResDeviceAP {
        private String apSSID;
        private String apPassword;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReqUpdate {
        private String id;
        private String name;
        private String description;
        private String apPassword;
    }
}
