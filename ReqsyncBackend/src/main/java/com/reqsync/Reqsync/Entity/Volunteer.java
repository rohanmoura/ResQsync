package com.reqsync.Reqsync.Entity;

import java.util.List;

import com.reqsync.Reqsync.Dto.VolunterrTypes;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
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
    @JoinColumn(name = "volunteer_email", referencedColumnName = "email", nullable = false)
    private User user;

    @Column(name = "volunteer_name", nullable = false)
    private String name;

    @Column(name = "phone_number", nullable = false)
    private String phone;

    @Column(name = "area_name", nullable = false)
    private String area;

    @Lob
    @Column(columnDefinition = "LONGBLOB", nullable = false)
    private String about;

    // Store volunteering types as an ENUM list
    @ElementCollection(targetClass = VolunterrTypes.class) /// Allows storing a list of values (like
                                                           /// List<VolunteerTypes>) as a collection inside the same
                                                           /// entity.
    @CollectionTable(name = "volunteer_types", joinColumns = @JoinColumn(name = "volunteer_id")) // Defines a new table
                                                                                                 // called
                                                                                                 // volunteer_types that
                                                                                                 // will store the
                                                                                                 // volunteeringTypes
                                                                                                 // values.
    @Enumerated(EnumType.STRING) // Specifies that the values of the enum will be stored as strings in the
                                 // database.
    @Column(name = "volunteering_type", nullable = false)
    private List<VolunterrTypes> volunteeringTypes;

    @CollectionTable(name = "volunteer_skills", joinColumns = @JoinColumn(name = "volunteer_id"))
    @Column(name = "skill", nullable = false)
    private List<String> skills;
}
