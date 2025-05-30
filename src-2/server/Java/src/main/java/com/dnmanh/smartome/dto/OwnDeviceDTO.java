package com.dnmanh.smartome.dto;

import com.dnmanh.smartome.util.constant.DeviceType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class OwnDeviceDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReqCreate {
        private Long idUser;
        private String idDevice;
        private String idHouse;
        private String idRoom;
        private String name;
        private String description;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Res {
        private String id;
        private String name;
        private String description;
        private String topicSend;
        private String topicReceive;
        private DeviceType type;
        private ResOwnDeviceSetting setting;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResOwnDeviceSetting {
        private Boolean isSaveState;
        private Boolean isResetConfirm;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReqUpdate {
        private Long idUser;
        private String id;
        private String name;
        private String description;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReqUpdateSetting {
        private Long idUser;
        private String idOwnDevice;
        private Boolean isSaveState;
        private Boolean isResetConfirm;
    }

}
