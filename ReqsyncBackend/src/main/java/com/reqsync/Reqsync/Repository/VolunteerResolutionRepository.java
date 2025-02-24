package com.reqsync.Reqsync.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reqsync.Reqsync.Entity.VolunteerResolution;

@Repository
public interface VolunteerResolutionRepository extends JpaRepository<VolunteerResolution, Long> {

}
