package com.dnmanh.smartome.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class RoomDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReqCreate {
        private Long idUser;
        private String idHouse;
        private String name;
        private String description;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResCreate {
        private String idHouse;
        private String name;
        private String description;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReqUpdate {
        private Long idUser;
        private String roomId;
        private String name;
        private String description;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResUpdate {
        private String roomId;
        private String name;
        private String description;
    }
}
