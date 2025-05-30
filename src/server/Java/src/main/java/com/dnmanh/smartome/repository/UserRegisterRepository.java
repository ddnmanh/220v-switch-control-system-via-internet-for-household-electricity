package com.dnmanh.smartome.repository;

import com.dnmanh.smartome.entity.UserRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface UserRegisterRepository extends JpaRepository<UserRegister, Long> {
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM UserRegister u WHERE u.email = :email AND u.expiresAt > :timeNow ")
    boolean existsByEmailAndNonExpired(String email, Instant timeNow);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM UserRegister u WHERE u.username = :username AND u.expiresAt > :timeNow ")
    boolean existsByUsernameAndNonExpired(String username, Instant timeNow);

    @Query("SELECT u FROM UserRegister u WHERE u.email = :email AND u.expiresAt > :timeNow ")
    UserRegister findByEmailAndNonExpired(String email, Instant timeNow);

}
