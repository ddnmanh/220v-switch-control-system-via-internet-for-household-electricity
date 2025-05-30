package com.dnmanh.smartome.config.security;

import java.util.Collections;

import com.dnmanh.smartome.dto.exception.InvalidFieldDTO;
import com.dnmanh.smartome.util.error.FieldsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import com.dnmanh.smartome.service.UserService;

@Component("userDetailsService")
public class UserDetailsCustom implements UserDetailsService {

    private final UserService userService;

    public UserDetailsCustom(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws FieldsException {

        com.dnmanh.smartome.entity.User user = this.userService.handleGetUserByUsername(username);

        if (user == null) {
            throw new FieldsException(Collections.singletonList(
                    new InvalidFieldDTO("username", "Username does not exist")
            ));
        }

        return new User(
                user.getUsername(),
                user.getPassword(),
                true,
                true,
                true,
                !user.isBlocked(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getName()))
        );
    }

}
