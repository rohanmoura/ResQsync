package com.reqsync.Reqsync.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reqsync.Reqsync.Entity.HelpRequest;



@Repository
public interface HelpRequestRepository extends JpaRepository<HelpRequest, String> {

    Optional<HelpRequest> findByEmail(String email);
}
