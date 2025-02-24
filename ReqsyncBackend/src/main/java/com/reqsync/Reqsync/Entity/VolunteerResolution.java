package com.reqsync.Reqsync.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VolunteerResolution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "volunteer_id", nullable = false)
    private Long volunteerId; // ID of the volunteer who marked as resolved
    @Column(name = "request_id", nullable = false)
    private Long requestId; // The request they resolved
    @Column(name = "resolved_at", nullable = false)
    private LocalDateTime resolvedAt = LocalDateTime.now();
}
