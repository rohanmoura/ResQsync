package com.reqsync.Reqsync.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

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
import com.reqsync.Reqsync.Dto.VolunteerFormDto;
import com.reqsync.Reqsync.Dto.VolunterrTypes;
import com.reqsync.Reqsync.Entity.Roles;
import com.reqsync.Reqsync.Entity.User;
import com.reqsync.Reqsync.Entity.Volunteer;
import com.reqsync.Reqsync.Repository.RoleRepository;
import com.reqsync.Reqsync.Repository.UserRepository;
import com.reqsync.Reqsync.Repository.VolunteerRepository;
import com.reqsync.Reqsync.Repository.VolunteerTypeRepository;

@Service
public class VolunteerService {

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private VolunteerTypeRepository volunteerTypeRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Adds a new Volunteer if the user is authenticated and the email is valid.
     */

    @Transactional
    public void addVolunteer(VolunteerFormDto volunteerProfileDto) {

        if (volunteerProfileDto.getVolunteeringTypes() == null
                || volunteerProfileDto.getVolunteeringTypes().isEmpty()) {
            throw new IllegalArgumentException("At least one volunteering type is required.");
        }
        if (volunteerProfileDto.getSkills() == null || volunteerProfileDto.getSkills().isEmpty()) {
            throw new IllegalArgumentException("At least one skill is required.");
        }
        if (volunteerProfileDto.getAbout() == null || volunteerProfileDto.getAbout().trim().isEmpty()) {
            throw new IllegalArgumentException("About section cannot be null or blank.");
        }

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
        if (user.getName() == null || user.getPhone() == null || user.getArea() == null) {
            throw new IllegalArgumentException("User details are incomplete. Please update your profile first.");

        }
        Volunteer volunteer = new Volunteer();
        volunteer.setName(user.getName());
        volunteer.setUser(user);
        volunteer.setPhone(user.getPhone());
        volunteer.setArea(user.getArea());

        volunteer.setVolunteeringTypes(volunteerProfileDto.getVolunteeringTypes());
        volunteer.setSkills(volunteerProfileDto.getSkills());
        volunteer.setAbout(volunteerProfileDto.getAbout());

        // Save the volunteer to the database
        volunteerRepository.save(volunteer);
        emailService.sendVolunteerWelcomeEmail(user.getEmail(),
                user.getName());

    }

    public boolean deleteVolunteerRole(String email) {
        Roles volunteerRole = roleRepository.findByRole("VOLUNTEER");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsersNotFound("User not found with email: " + email));

        Volunteer volunteer = volunteerRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("No Volunterr found"));
        if (volunteerRole == null) {
            throw new IllegalArgumentException("Role not found: VOLUNTEER");
        }

        if (user != null) {
            if (!user.getRoles().contains(volunteerRole)) {
                throw new IllegalArgumentException("User does not have the VOLUNTEER role");
            }
            user.getRoles().remove(volunteerRole);

            volunteerRepository.deleteByUser(user);
            // volunteerSkillsRepository.deleteAllByVolunteerId(volunteer.getId());
            volunteerTypeRepository.deleteAllByVolunteerId(volunteer.getId());
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean updateVolunteer(VolunteerFormDto volunteerFormDto) {
        // Validate authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new WrongAuthenticationCredentials("User not authenticated. Please log in first.");
        }

        // Retrieve the authenticated user's email
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();

        // Fetch the user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        // Fetch the volunteer associated with the user
        Volunteer volunteer = volunteerRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("No Volunteer found for user: " + email));

        boolean changed = false;

        // Update volunteering types only if the field is explicitly provided and not
        // empty
        if (volunteerFormDto.getVolunteeringTypes() != null && !volunteerFormDto.getVolunteeringTypes().isEmpty()) {
            List<VolunterrTypes> currentTypes = volunteer.getVolunteeringTypes() == null
                    ? new ArrayList<>()
                    : volunteer.getVolunteeringTypes();
            if (!new HashSet<>(currentTypes).equals(new HashSet<>(volunteerFormDto.getVolunteeringTypes()))) {
                volunteer.setVolunteeringTypes(new ArrayList<>(volunteerFormDto.getVolunteeringTypes()));
                changed = true;
            }
        }

        // Update skills only if the field is explicitly provided and not empty
        if (volunteerFormDto.getSkills() != null && !volunteerFormDto.getSkills().isEmpty()) {
            List<String> currentSkills = volunteer.getSkills() == null
                    ? new ArrayList<>()
                    : volunteer.getSkills();
            if (!new HashSet<>(currentSkills).equals(new HashSet<>(volunteerFormDto.getSkills()))) {
                volunteer.setSkills(new ArrayList<>(volunteerFormDto.getSkills()));
                changed = true;
            }
        }

        // Update the "about" field only if it is explicitly provided and not empty
        if (volunteerFormDto.getAbout() != null && !volunteerFormDto.getAbout().trim().isEmpty()) {
            if (volunteer.getAbout() == null || !volunteer.getAbout().equals(volunteerFormDto.getAbout())) {
                volunteer.setAbout(volunteerFormDto.getAbout());
                changed = true;
            }
        }

        // Save the volunteer only if there were changes
        if (changed) {
            volunteerRepository.save(volunteer);
        }

        return changed;
    }

    public VolunteerFormDto volunteerProfileInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsersNotFound("User not found with email: " + email));

        Volunteer volunteer = volunteerRepository.findByUser(user)
                .orElseThrow(() -> new UsersNotFound("Volunteer not found with email: " + email));

        return VolunteerFormDto.builder()
                .volunteeringTypes(volunteer.getVolunteeringTypes())
                .skills(volunteer.getSkills())
                .about(volunteer.getAbout())
                .build();
    }
}
