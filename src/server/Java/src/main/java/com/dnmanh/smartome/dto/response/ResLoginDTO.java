package com.dnmanh.smartome.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResLoginDTO {


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TokenDTO {
        private String token;
        private long lifeTime;
    }

    private TokenDTO accessToken;
    private TokenDTO refreshToken;

}


