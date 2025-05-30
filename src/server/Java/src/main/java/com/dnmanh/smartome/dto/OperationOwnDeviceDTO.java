package com.dnmanh.smartome.dto;

import com.dnmanh.smartome.util.constant.DeviceType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class OperationOwnDeviceDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Res {
        private Long id;
        private Boolean state;
        private Instant enventDateTime;
    }
}
