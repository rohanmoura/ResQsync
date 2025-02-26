package com.reqsync.Reqsync.Service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reqsync.Reqsync.CustomException.HelpRequestorAccessed;
import com.reqsync.Reqsync.CustomException.UsersNotFound;
import com.reqsync.Reqsync.CustomException.VolunteerAccessed;
import com.reqsync.Reqsync.CustomException.WrongAuthenticationCredentials;
import com.reqsync.Reqsync.Dto.NotificationDto;
import com.reqsync.Reqsync.Dto.VolunteerDto;
import com.reqsync.Reqsync.Dto.VolunteerFormDto;
import com.reqsync.Reqsync.Entity.HelpRequest;
import com.reqsync.Reqsync.Entity.RequestStatus;
import com.reqsync.Reqsync.Entity.Roles;
import com.reqsync.Reqsync.Entity.User;
import com.reqsync.Reqsync.Entity.Volunteer;
import com.reqsync.Reqsync.Entity.VolunteerResolution;
import com.reqsync.Reqsync.Repository.HelpRequestRepository;
import com.reqsync.Reqsync.Repository.RoleRepository;
import com.reqsync.Reqsync.Repository.UserRepository;
import com.reqsync.Reqsync.Repository.VolunteerRepository;
import com.reqsync.Reqsync.Repository.VolunteerResolutionRepository;
import com.reqsync.Reqsync.Repository.VolunteerSkillsRepository;
import com.reqsync.Reqsync.Repository.VolunteerTypeRepository;

@Service
public class VolunteerService {

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HelpRequestRepository helpRequestRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private VolunteerResolutionRepository volunteerResolutionRepository;

    @Autowired
    private VolunteerTypeRepository volunteerTypeRepository;

    @Autowired
    private VolunteerSkillsRepository volunteerSkillsRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Adds a new Volunteer if the user is authenticated and the email is valid.
     */

    @Transactional
    public void addVolunteer(VolunteerFormDto volunteerProfileDto) {
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
    public boolean confirmRequestStatus(Long id, Long vId) {

        HelpRequest helpRequest = helpRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Help request not found with id: " + id));

        Volunteer volunteer = volunteerRepository.findById(vId)
                .orElseThrow(() -> new IllegalArgumentException("Volunteer not found with id: " + vId));
        if (helpRequest.getStatus() != RequestStatus.PENDING) {
            throw new IllegalArgumentException("Help request is not pending");
        }
        helpRequest.setStatus(RequestStatus.RESOLVED);
        VolunteerResolution volunteerResolution = new VolunteerResolution();
        volunteerResolution.setVolunteerId(vId);
        volunteerResolution.setRequestId(id);
        helpRequestRepository.save(helpRequest);
        volunteerResolutionRepository.save(volunteerResolution);
        emailService.sendRequestFulfilledEmail(helpRequest.getUser().getEmail(), helpRequest.getUser().getName(),
                volunteer.getUser().getName(), helpRequest.getHelpType(), volunteerResolution.getResolvedAt());

        return true;
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

        // Update volunteering types if provided
        if (volunteerFormDto.getVolunteeringTypes() != null && !volunteerFormDto.getVolunteeringTypes().isEmpty()) {
            // Merge the new volunteering types
            volunteer.getVolunteeringTypes().addAll(volunteerFormDto.getVolunteeringTypes());
        }

        // Update skills if provided
        if (volunteerFormDto.getSkills() != null && !volunteerFormDto.getSkills().isEmpty()) {
            volunteer.getSkills().addAll(volunteerFormDto.getSkills());
        }

        // Update the "about" field if provided
        if (volunteerFormDto.getAbout() != null && !volunteerFormDto.getAbout().trim().isEmpty()) {
            volunteer.setAbout(volunteerFormDto.getAbout());
        }

        // Persist the updated volunteer entity
        volunteerRepository.save(volunteer);

        return true;
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
