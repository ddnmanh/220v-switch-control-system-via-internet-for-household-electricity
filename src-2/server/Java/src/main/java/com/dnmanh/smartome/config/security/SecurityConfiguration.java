package com.dnmanh.smartome.config.security;

import com.dnmanh.smartome.config.jwt.CustomAuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {

    @Value("${env.jwt.base64-secret}")
    private String jwtKey;

    @Value("${env.upload-file.url-path}")
    private String urlPathStaticResource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10); // Độ phức tạp của mã hóa
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            CustomAuthenticationEntryPoint customAuthenticationEntryPoint
    ) throws Exception {

        // Danh sách url không cần xác thực khi truy cập
        String[] whiteList = {
                "/",
                "/api/v1/auth/log-in",
                "/api/v1/users/register",
                "/api/v1/users/register/verify-otp",
                "/api/v1/users/register/resend-verify-otp",
                "/api/v1/houses/**",
                this.urlPathStaticResource.toString(),
                "/api/v1/devices/**",
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-ui.html"
        };

        http
                .csrf(c -> c.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(authz -> authz
                    .requestMatchers(whiteList).permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/companies/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/jobs/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/skills/**").permitAll()
                    .anyRequest().authenticated())
                .oauth2ResourceServer((oauth2) -> oauth2.jwt(Customizer.withDefaults())
                .authenticationEntryPoint(customAuthenticationEntryPoint))

                .formLogin(f -> f.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

}
