package com.reqsync.Reqsync.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.reqsync.Reqsync.Entity.User;
import com.reqsync.Reqsync.Entity.Volunteer;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {

    @Query("SELECT v FROM Volunteer v WHERE v.user = :user")
    Optional<Volunteer> findByUser(User user);
}
