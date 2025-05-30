package com.dnmanh.smartome.config.permission;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.dnmanh.smartome.entity.Permission;
import com.dnmanh.smartome.entity.Role;
import com.dnmanh.smartome.entity.User;
import com.dnmanh.smartome.service.UserService;
import com.dnmanh.smartome.util.security.SecurityUtil;
import com.dnmanh.smartome.util.error.PermissionException;

public class PermissionInterceptor implements HandlerInterceptor {

    @Autowired
    UserService userService;

    @Override
    @Transactional
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) throws Exception {

        String path = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String requestURI = request.getRequestURI();
        String httpMethod = request.getMethod();
        System.out.println(">>> RUN preHandle");
        System.out.println(">>> path= " + path);
        System.out.println(">>> httpMethod= " + httpMethod);
        System.out.println(">>> requestURI= " + requestURI);

        // check permission from token on bearer header http request
        String username = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        if (!username.isEmpty()) {
            User user = this.userService.handleGetUserByUsername(username);
            if (user != null) {
                Role role = user.getRole();
                if (role != null) {
                    List<Permission> permissions = role.getPermissions();
                    boolean isAllow = permissions.stream().anyMatch(item -> item.getApiPath().equals(path)
                            && item.getMethod().equals(httpMethod));

                    if (!isAllow) {
                        throw new PermissionException("Bạn không có quyền truy cập url này.");
                    }
                } else {
                    throw new PermissionException("Bạn không có quyền truy cập url này.");
                }
            }
        }

        return true;
    }
}
