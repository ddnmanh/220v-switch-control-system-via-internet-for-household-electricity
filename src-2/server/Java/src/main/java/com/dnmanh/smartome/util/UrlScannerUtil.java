package com.dnmanh.smartome.util;

import com.dnmanh.smartome.entity.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.ArrayList;
import java.util.Map;

@Component
public class UrlScannerUtil {

    @Autowired
    private RequestMappingHandlerMapping requestMappingHandlerMapping;

    public void print() {
        Map<RequestMappingInfo, HandlerMethod> map = requestMappingHandlerMapping.getHandlerMethods();

        ArrayList<Permission> arrPermissions = new ArrayList<>();

        map.forEach((requestMappingInfo, handlerMethod) -> {
            System.out.println("URL: " + requestMappingInfo.getPathPatternsCondition());
            System.out.println("URL: " + requestMappingInfo.getPatternsCondition());
            System.out.println("Methods: " + requestMappingInfo.getMethodsCondition());
            System.out.println("Handler: " + handlerMethod.getBeanType().getName() + "#" + handlerMethod.getMethod().getName());
            System.out.println("-------------------------------------");
            arrPermissions.add(new Permission(
                    "",
                    requestMappingInfo.getPathPatternsCondition().toString().substring(1, requestMappingInfo.getPathPatternsCondition().toString().length() - 1),
                    requestMappingInfo.getMethodsCondition().toString().substring(1, requestMappingInfo.getMethodsCondition().toString().length() - 1),
                    "PERMISSIONS"
            ));
        });
    }

    public ArrayList<Permission> getAllPermision() {
        Map<RequestMappingInfo, HandlerMethod> map = requestMappingHandlerMapping.getHandlerMethods();

        ArrayList<Permission> arrPermissions = new ArrayList<>();

        map.forEach((requestMappingInfo, handlerMethod) -> {
            arrPermissions.add(new Permission(
                    "",
                    requestMappingInfo.getPathPatternsCondition().toString().substring(1, requestMappingInfo.getPathPatternsCondition().toString().length() - 1),
                    requestMappingInfo.getMethodsCondition().toString().substring(1, requestMappingInfo.getMethodsCondition().toString().length() - 1),
                    "PERMISSIONS"
            ));
        });

        return arrPermissions;
    }
}
