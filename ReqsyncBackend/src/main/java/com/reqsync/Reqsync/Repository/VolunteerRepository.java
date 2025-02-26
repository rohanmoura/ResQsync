package com.reqsync.Reqsync.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.reqsync.Reqsync.Entity.User;
import com.reqsync.Reqsync.Entity.Volunteer;

import jakarta.transaction.Transactional;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {

    @Query("SELECT v FROM Volunteer v WHERE v.user = :user")
    Optional<Volunteer> findByUser(User user);

    @Transactional
    @Modifying
    @Query("DELETE FROM Volunteer v WHERE v.user = :user")
    void deleteByUser(@Param("user") User user);
}
