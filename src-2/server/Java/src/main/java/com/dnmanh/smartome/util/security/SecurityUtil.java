package com.dnmanh.smartome.util.security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.dnmanh.smartome.entity.Role;
import com.dnmanh.smartome.dto.response.UserDTO;
import com.dnmanh.smartome.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.util.Base64;


@Service
public class SecurityUtil {

    private final JwtEncoder jwtEncoder;

    public SecurityUtil(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

    @Value("${env.jwt.base64-secret}")
    private String jwtKey;

    @Value("${env.jwtaccess-token-exprires-sec}")
    private long accessTokenExpiration;

    @Value("${env.jwtrefresh-token-exprires-sec}")
    private long refreshTokenExpiration;

    public String createAccessToken(String email, UserDTO.ResUserDTO userData) {

        UserDTO.UserInsideTokenDTO userInsideTokenDTO = new UserDTO.UserInsideTokenDTO(
                userData.getId(),
                userData.getName(),
                userData.getEmail(),
                userData.getRole()
        );

        Instant now = Instant.now();
        Instant validity = now.plus(this.accessTokenExpiration, ChronoUnit.SECONDS);

        // hardcode permission (for testing)
        List<String> listAuthority = new ArrayList<String>();

        if (userData.getRole().getClass().isArray()) {
            System.out.println("Role is an array");
            for (Role role : (List<Role>) userData.getRole()) {
                listAuthority.add(role.getName());
            }
        } else {
            System.out.println("Role is not an array");
            listAuthority.add(userData.getRole().getName());
        }

        // @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuedAt(now)
            .expiresAt(validity)
            .subject(email)
            .claim("user", userInsideTokenDTO)
            .claim("permission", listAuthority)
            .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();

    }

    public String createRefreshToken(String email, UserDTO.ResUserDTO userData) {
        UserDTO.UserInsideTokenDTO userInsideTokenDTO = new UserDTO.UserInsideTokenDTO(
                userData.getId(),
                userData.getName(),
                userData.getEmail(),
                userData.getRole()
        );

        Instant now = Instant.now();
        Instant validity = now.plus(this.refreshTokenExpiration, ChronoUnit.SECONDS);


        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuedAt(now)
            .expiresAt(validity)
            .subject(email)
            .claim("user", userInsideTokenDTO)
            .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();

    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtKey).decode();
        return new SecretKeySpec(
                keyBytes,
                0,
                keyBytes.length,
                JWT_ALGORITHM.getName()
        );
    }

    public Jwt checkValidRefreshToken(String token){
     NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(
                getSecretKey()).macAlgorithm(SecurityUtil.JWT_ALGORITHM).build();
                try {
                     return jwtDecoder.decode(token);
                } catch (Exception e) {
                    System.out.println(">>> Refresh Token error: " + e.getMessage());
                    throw e;
                }
    }

    public static UserDetails getUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }
        return (UserDetails) authentication.getPrincipal();
    }

    /**
     * Get the login of the current user.
     *
     * @return the login of the current user.
     */
    public static Optional<String> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
    }

    public static Optional<Long> getUserInfoInJWT(String property) {
        SecurityContext securityContext = SecurityContextHolder.getContext();

        // Get user info from token
        Jwt jwt = (Jwt) securityContext.getAuthentication().getPrincipal();

//        jwt.getClaims().forEach((k, v) -> {
//            System.out.println(k + " : " + v);
//        });

        long userId = ((Number) ((Map<String, Object>) jwt.getClaims().get("user")).get(property)).longValue();

        return Optional.ofNullable(userId);
    }

    public static Long getIdUserInJWT() {
        SecurityContext securityContext = SecurityContextHolder.getContext();

        // Get user info from token
        Jwt jwt = (Jwt) securityContext.getAuthentication().getPrincipal();

        long userId = ((Number) ((Map<String, Object>) jwt.getClaims().get("user")).get("id")).longValue();

        return userId;
    }

    private static String extractPrincipal(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        } else if (authentication.getPrincipal() instanceof String s) {
            return s;
        }
        return null;
    }

    /**
     * Get the JWT of the current user.
     *
     * @return the JWT of the current user.
     */
    public static Optional<String> getCurrentUserJWT() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(securityContext.getAuthentication())
            .filter(authentication -> authentication.getCredentials() instanceof String)
            .map(authentication -> (String) authentication.getCredentials());
    }

}
