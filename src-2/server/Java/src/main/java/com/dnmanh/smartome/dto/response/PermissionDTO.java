package com.dnmanh.smartome.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class PermissionDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResPermissionDTO {
        private long id;
        private String name;
        private String apiPath;
        private String method;
        private String module;
    }
}
