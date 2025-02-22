package com.reqsync.Reqsync.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
    @Column(name = "volunteer_email" , nullable = false)
    private String email;
    
    @Column(name = "volunteer_name" , nullable = false)
    private String name;
    
    @Column(name = "phone_number" , nullable = false)
    private String phone;
    
    @Column(name = "area_name" , nullable = false)
    private String area;
}
