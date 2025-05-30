package com.dnmanh.smartome.repository;

import com.dnmanh.smartome.entity.HistoryLogIn;
import com.dnmanh.smartome.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HistoryLogInRepository extends JpaRepository<HistoryLogIn, Long> {

    @Query("""
        SELECT h.user
        FROM HistoryLogIn h
        WHERE h.refreshToken = :refreshToken
            AND h.user.username = :username
            AND h.isDeleted = false
    """)
    Optional<User> findUserByRefreshTokenAndUsernameAndIsDeletedFalse(
        @Param("refreshToken") String refreshToken,
        @Param("username") String username
    );

    @Modifying
    @Transactional
    @Query("""
        UPDATE HistoryLogIn h
        SET h.isDeleted = true
        WHERE h.user.username = :username
            AND h.isDeleted = false
    """)
    int updateIsDeletedTrueByUsername(@Param("username") String username);

}
