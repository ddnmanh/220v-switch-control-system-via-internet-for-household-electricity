package com.dnmanh.smartome.config.permission;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class PermissionInterceptorConfiguration implements WebMvcConfigurer {
    @Bean
    PermissionInterceptor getPermissionInterceptor() {
        return new PermissionInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        // Danh sách url không cần kiểm tra quyền của người dùng
        String[] whiteList = {
                "/",
                "/api/v1/auth/**",
                "/api/v1/houses/**",
                "/api/v1/rooms/**",
                "/api/v1/own-devices/**",
                "/v3/api-docs/**",
        };
        registry.addInterceptor(getPermissionInterceptor())
                .excludePathPatterns(whiteList);
    }
}
