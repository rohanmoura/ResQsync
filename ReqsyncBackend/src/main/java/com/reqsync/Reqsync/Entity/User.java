package com.reqsync.Reqsync.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "signup_users")
@Data
public class User {

    @Id
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "user_name", nullable = true)
    private String name;

    @Column(name = "phone_number", nullable = true)
    private String phone;

    @Column(name = "area_name", nullable = true)
    private String area;

    @Column(name = "short_bio", nullable = true, columnDefinition = "TEXT")
    private String bio;

    @Column(name = "profile_picture", nullable = true, columnDefinition = "LONGBLOB")
    private byte[] profilePicture;

    @ManyToMany(fetch = FetchType.EAGER)
    @JsonManagedReference
    @JoinTable(name = "signupuser_roles", joinColumns = @JoinColumn(name = "user_email", referencedColumnName = "email"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private List<Roles> roles;

    @OneToMany(mappedBy = "user", cascade = { CascadeType.REMOVE, CascadeType.MERGE,
            CascadeType.PERSIST }, orphanRemoval = true)
    @Column(nullable = true)
    private List<HelpRequest> helpRequests;

    @OneToOne(mappedBy = "user", cascade = { CascadeType.REMOVE, CascadeType.MERGE,
            CascadeType.PERSIST }, orphanRemoval = true)
    @JoinColumn(nullable = true)
    private Volunteer volunteers;

}
