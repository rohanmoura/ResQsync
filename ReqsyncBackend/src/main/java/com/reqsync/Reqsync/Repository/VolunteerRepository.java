package com.reqsync.Reqsync.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reqsync.Reqsync.Entity.Volunteer;



@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, String> {

    Optional<Volunteer> findByEmail(String email);
}
