package com.reqsync.Reqsync.Service;

import com.reqsync.Reqsync.CustomException.UsersNotFound;
import com.reqsync.Reqsync.Dto.HelpRequestDto;
import com.reqsync.Reqsync.Entity.HelpRequest;
import com.reqsync.Reqsync.Entity.Roles;
import com.reqsync.Reqsync.Entity.User;
import com.reqsync.Reqsync.Repository.HelpRequestRepository;
import com.reqsync.Reqsync.Repository.RoleRepository;
import com.reqsync.Reqsync.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class HelpRequestService {

    @Autowired
    private HelpRequestRepository helpRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    public void addHelpRequest(HelpRequestDto helpRequestDto) {
        // Check if the current user is authenticated
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("User not authenticated. Please log in first.");
        }

        // Check if the email exists in the user repository
        String userEmail = helpRequestDto.getEmail();
        Optional<User> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found with email: " + userEmail);
        }

        User user = userOptional.get();

        // Check if the user already has the "HELP_REQUESTER" role
        Roles helpRequesterRole = roleRepository.findByRole("HELPREQUESTER");
        if (helpRequesterRole == null) {
            throw new IllegalArgumentException("Role not found: HELP_REQUESTER");
        }

        if (!user.getRoles().contains(helpRequesterRole)) {
            // Add the "HELP_REQUESTER" role to the user
            user.getRoles().add(helpRequesterRole);
            userRepository.save(user); // Save the updated user with the new role
        }

        // Convert HelpRequestDto to HelpRequest entity
        HelpRequest helpRequest = new HelpRequest();
        helpRequest.setName(helpRequestDto.getName());
        helpRequest.setEmail(userEmail);
        helpRequest.setPhone(helpRequestDto.getPhone());
        helpRequest.setArea(helpRequestDto.getArea());
        helpRequest.setHelpType(helpRequestDto.getHelpType());
        helpRequest.setMessage(helpRequestDto.getMessage());

        // Save the help request to the database
        helpRequestRepository.save(helpRequest);
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
