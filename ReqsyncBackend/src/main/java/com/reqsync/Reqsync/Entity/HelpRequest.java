package com.reqsync.Reqsync.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table
@Getter
@Setter
public class HelpRequest {

    @Id
    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone_number", nullable = false)
    private String phone;

    @Column(name = "area_name", nullable = false)
    private String area;

    @Column(name = "help_type", nullable = false)
    private String helpType;

    @Lob
    @Column(columnDefinition = "LONGBLOB", nullable = false)
    private String message;
}
