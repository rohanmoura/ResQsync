package com.reqsync.Reqsync.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reqsync.Reqsync.Entity.RequestHelperIssue;

@Repository
public interface HelpRequestorIssueRepository extends JpaRepository<RequestHelperIssue, Long> {
}