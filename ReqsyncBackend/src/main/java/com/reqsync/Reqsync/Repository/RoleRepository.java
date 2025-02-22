package com.reqsync.Reqsync.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reqsync.Reqsync.Entity.*;

@Repository
public interface RoleRepository extends JpaRepository<Roles, Integer> {
    Roles findByRole(String role);

    boolean existsByRole(String role);
}
