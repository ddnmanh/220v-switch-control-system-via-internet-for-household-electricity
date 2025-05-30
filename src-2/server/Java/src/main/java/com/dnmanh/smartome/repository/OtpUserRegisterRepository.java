package com.dnmanh.smartome.repository;

import com.dnmanh.smartome.entity.OtpUserRegister;
import com.dnmanh.smartome.entity.UserRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface OtpUserRegisterRepository extends JpaRepository<OtpUserRegister, Long> {

    void deleteByUserRegister(UserRegister userRegister);

    @Query("SELECT o FROM OtpUserRegister o WHERE o.userRegister.email = :email AND o.otp = :otp AND o.expiresAt > :expiresAt")
    OtpUserRegister findByEmailAndOtpAndExpiresAtAfter(String email, String otp, Instant expiresAt);
}
