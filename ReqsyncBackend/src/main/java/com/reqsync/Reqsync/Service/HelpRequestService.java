package com.reqsync.Reqsync.Service;

import com.reqsync.Reqsync.CustomException.AlreadyUsedEmail;
import com.reqsync.Reqsync.CustomException.UsersNotFound;
import com.reqsync.Reqsync.Dao.HelpRequestDao;
import com.reqsync.Reqsync.Entity.HelpRequest;
import com.reqsync.Reqsync.Entity.Roles;
import com.reqsync.Reqsync.Entity.User;
import com.reqsync.Reqsync.Events.HelpRequestCreatedEvent;
import com.reqsync.Reqsync.Repository.HelpRequestRepository;
import com.reqsync.Reqsync.Repository.RoleRepository;
import com.reqsync.Reqsync.Repository.UserRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class HelpRequestService {

    @Autowired
    private HelpRequestRepository helpRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Transactional
    public void addHelpRequest(HelpRequestDao helpRequestDao) {
        // Check if the current user is authenticated
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("User not authenticated. Please log in first.");
        }

        String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
        log.debug("Here is the email  : " + userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + userEmail));

        // Check if the user already has the "HELP_REQUESTER" role
        Roles helpRequesterRole = roleRepository.findByRole("HELPREQUESTER");
        Roles volunteerRoles = roleRepository.findByRole("VOLUNTEER");
        if (helpRequesterRole == null) {
            throw new IllegalArgumentException("Role not found: HELP_REQUESTER");
        }

        if (user.getRoles().contains(volunteerRoles)) {
            throw new AlreadyUsedEmail(
                    "You already has the HelpRequestor role or you are a volunteer if you are a volunterr then remove your role then ask for help");
        }

        if (!user.getRoles().contains(helpRequesterRole)) {
            // Add the "HELP_REQUESTER" role to the user
            user.getRoles().add(helpRequesterRole);
            userRepository.save(user); // Save the updated user with the new role
        }

        // Convert HelpRequestDto to HelpRequest entity
        HelpRequest helpRequest = HelpRequest.builder()
                .user(user) // ✅ Set the requesting user
                .name(helpRequestDao.getName())
                .phone(helpRequestDao.getPhone())
                .area(helpRequestDao.getArea())
                .helpType(helpRequestDao.getHelpType())
                .message(helpRequestDao.getMessage())
                .build();

        // Save the help request to the database
        helpRequestRepository.save(helpRequest);
        eventPublisher.publishEvent(new HelpRequestCreatedEvent(this, helpRequest)); // ✅ Triggering event

    }

    public boolean deleteHelpRequestorRole(String email) {
        Roles helpRequestorRoles = roleRepository.findByRole("HELPREQUESTER");
        if (helpRequestorRoles == null) {
            throw new IllegalArgumentException("Role not found: HELPREQUESTER");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsersNotFound("User not found with email: " + email));

        if (user != null) {
            if (!user.getRoles().contains(helpRequestorRoles)) {
                throw new IllegalArgumentException("User does not have the HELPREQUESTER role");
            }
            user.getRoles().remove(helpRequestorRoles);
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
