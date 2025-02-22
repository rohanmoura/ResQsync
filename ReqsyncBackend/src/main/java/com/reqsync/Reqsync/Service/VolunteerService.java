package com.reqsync.Reqsync.Service;

import com.reqsync.Reqsync.CustomException.UsersNotFound;
import com.reqsync.Reqsync.Dto.VolunteerDto;
import com.reqsync.Reqsync.Entity.Roles;
import com.reqsync.Reqsync.Entity.Volunteer;
import com.reqsync.Reqsync.Entity.User;
import com.reqsync.Reqsync.Repository.RoleRepository;
import com.reqsync.Reqsync.Repository.UserRepository;
import com.reqsync.Reqsync.Repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VolunteerService {

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    /**
     * Adds a new Volunteer if the user is authenticated and the email is valid.
     */
    public void addVolunteer(VolunteerDto volunteerDto) {
        // Check if the current user is authenticated
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("User not authenticated. Please log in first.");
        }

        // Check if the email exists in the user repository
        String userEmail = volunteerDto.getEmail();
        Optional<User> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found with email: " + userEmail);
        }

        User user = userOptional.get();

        // Check if the user already has the "VOLUNTEER" role
        Roles volunteerRole = roleRepository.findByRole("VOLUNTEER");
        if (volunteerRole == null) {
            throw new IllegalArgumentException("Role not found: VOLUNTEER");
        }

        if (!user.getRoles().contains(volunteerRole)) {
            // Add the "VOLUNTEER" role to the user
            user.getRoles().add(volunteerRole);
            userRepository.save(user); // Save the updated user with the new role
        }

        // Convert VolunteerDto to Volunteer entity
        Volunteer volunteer = new Volunteer();
        volunteer.setName(volunteerDto.getName());
        volunteer.setEmail(userEmail);
        volunteer.setPhone(volunteerDto.getPhone());
        volunteer.setArea(volunteerDto.getArea());

        // Save the volunteer to the database
        volunteerRepository.save(volunteer);
    }

    public boolean deleteVolunteerRole(String email) {
        Roles volunteerRole = roleRepository.findByRole("VOLUNTEER");
        if (volunteerRole == null) {
            throw new IllegalArgumentException("Role not found: VOLUNTEER");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsersNotFound("User not found with email: " + email));

        if (user != null) {
            if (!user.getRoles().contains(volunteerRole)) {
                throw new IllegalArgumentException("User does not have the VOLUNTEER role");
            }
            user.getRoles().remove(volunteerRole);
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
