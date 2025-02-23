package com.reqsync.Reqsync.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@Table(name = "volunteers")
public class Volunteer {

    @Id
    @Column(name = "volunteer_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @Column(name = "volunteer_email", nullable = false)
    private User user;

    @Column(name = "volunteer_name", nullable = false)
    private String name;

    @Column(name = "phone_number", nullable = false)
    private String phone;

    @Column(name = "area_name", nullable = false)
    private String area;
}
