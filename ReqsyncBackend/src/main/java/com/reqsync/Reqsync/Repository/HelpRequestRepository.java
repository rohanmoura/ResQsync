package com.reqsync.Reqsync.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.reqsync.Reqsync.Entity.HelpRequest;
import com.reqsync.Reqsync.Entity.User;

@Repository
public interface HelpRequestRepository extends JpaRepository<HelpRequest, Long> {

    @Query("SELECT hr FROM HelpRequest hr WHERE hr.user = :user")
    List<HelpRequest> findAllByUser(@Param("user") User user);

    @Query("SELECT hr FROM HelpRequest hr WHERE hr.user = :user")
    Optional<HelpRequest> findByUser(@Param("user") User user);

    @Transactional
    @Modifying
    @Query("DELETE FROM HelpRequest h WHERE h.user = :user")
    void deleteByUser(@Param("user") User user);

}
