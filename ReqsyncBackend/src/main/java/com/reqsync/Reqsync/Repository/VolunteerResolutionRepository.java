package com.reqsync.Reqsync.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.reqsync.Reqsync.Entity.VolunteerResolution;

@Repository
public interface VolunteerResolutionRepository extends JpaRepository<VolunteerResolution, Long> {
    @Query("SELECT v.id FROM VolunteerResolution v WHERE v.requestId = :requestId") // Query to get the volunteer id who
    // resolved the request
    long findByHelpRequestId(@Param("requestId") Long requestId);
}
