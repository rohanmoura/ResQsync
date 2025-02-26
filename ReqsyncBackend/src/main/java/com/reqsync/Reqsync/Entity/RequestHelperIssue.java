package com.reqsync.Reqsync.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "request_helper_issue")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RequestHelperIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(name = "volunteer_email", nullable = false)
    private String volunteerEmail;

    @Column(name = "help_issuer_email", nullable = false)
    private String helpIssuerEmail;

    @Column(name = "reported_at", nullable = false, updatable = false)
    private LocalDateTime reportedAt = LocalDateTime.now();
}
