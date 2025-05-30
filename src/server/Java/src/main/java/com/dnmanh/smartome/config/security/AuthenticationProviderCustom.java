package com.dnmanh.smartome.config.security;

import com.dnmanh.smartome.dto.exception.InvalidFieldDTO;
import com.dnmanh.smartome.util.error.FieldsException;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class AuthenticationProviderCustom implements AuthenticationProvider {

    private final UserDetailsCustom userDetailsCustom;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationProviderCustom(UserDetailsCustom userDetailsCustom, PasswordEncoder passwordEncoder) {
        this.userDetailsCustom = userDetailsCustom;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        UserDetails userDetails;
        try {
            userDetails = this.userDetailsCustom.loadUserByUsername(username);
        } catch (Exception ex) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("username", "Username is not exist")));
        }

        if (!this.passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("password", "Password is not correct")));
        }

        if (!userDetails.isAccountNonLocked()) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("account", "Account is locked")));
        }

        if (!userDetails.isEnabled()) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("account", "Account was deleted")));
        }

        return new UsernamePasswordAuthenticationToken(
                userDetails.getUsername(),
                userDetails.getPassword(),
                userDetails.getAuthorities()
        );
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
