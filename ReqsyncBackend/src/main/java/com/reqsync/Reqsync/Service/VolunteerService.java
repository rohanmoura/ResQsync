package com.reqsync.Reqsync.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reqsync.Reqsync.CustomException.HelpRequestorAccessed;
import com.reqsync.Reqsync.CustomException.UsersNotFound;
import com.reqsync.Reqsync.CustomException.VolunteerAccessed;
import com.reqsync.Reqsync.CustomException.WrongAuthenticationCredentials;
import com.reqsync.Reqsync.Dao.VolunteerDto;
import com.reqsync.Reqsync.Entity.Roles;
import com.reqsync.Reqsync.Entity.User;
import com.reqsync.Reqsync.Entity.Volunteer;
import com.reqsync.Reqsync.Repository.RoleRepository;
import com.reqsync.Reqsync.Repository.UserRepository;
import com.reqsync.Reqsync.Repository.VolunteerRepository;

@Service
public class VolunteerService {

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Adds a new Volunteer if the user is authenticated and the email is valid.
     */

    @Transactional
    public void addVolunteer(VolunteerDto volunteerDto) {
        // Check if the current user is authenticated
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new WrongAuthenticationCredentials("User not authenticated. Please log in first.");
        }

        String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + userEmail));

        // Check if the user already has the "VOLUNTEER" role
        Roles volunteerRole = roleRepository.findByRole("VOLUNTEER");
        Roles helpRequesterRole = roleRepository.findByRole("HELPREQUESTER");
        if (volunteerRole == null) {
            throw new IllegalArgumentException("Role not found: VOLUNTEER");
        }

        if (user.getRoles().contains(volunteerRole)) {
            throw new VolunteerAccessed("User already has the VOLUNTEER role");
        }
        if (user.getRoles().contains(helpRequesterRole)) {
            throw new HelpRequestorAccessed("User already has the HELP_REQUESTER role");
        }

        if (!user.getRoles().contains(volunteerRole)) {
            // Add the "VOLUNTEER" role to the user
            user.getRoles().add(volunteerRole);
            userRepository.save(user); // Save the updated user with the new role
        }

        // Convert VolunteerDto to Volunteer entity
        Volunteer volunteer = new Volunteer();
        volunteer.setName(volunteerDto.getName());
        volunteer.setUser(user);
        volunteer.setPhone(volunteerDto.getPhone());
        volunteer.setArea(volunteerDto.getArea());

        // Save the volunteer to the database
        volunteerRepository.save(volunteer);
        emailService.sendVolunteerWelcomeEmail(user.getEmail(),
                volunteerDto.getName());
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
