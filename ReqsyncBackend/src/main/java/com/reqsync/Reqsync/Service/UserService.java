package com.reqsync.Reqsync.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.reqsync.Reqsync.Config.EncoderConfig;
import com.reqsync.Reqsync.CustomException.AlreadyUsedEmail;
import com.reqsync.Reqsync.CustomException.ImageNotSaved;
import com.reqsync.Reqsync.CustomException.UsersNotFound;
import com.reqsync.Reqsync.Dto.UserDto;

import com.reqsync.Reqsync.Dto.UserProfileDto;
import com.reqsync.Reqsync.Dto.UserUpdateDto;
import com.reqsync.Reqsync.Entity.Roles;
import com.reqsync.Reqsync.Entity.User;

import com.reqsync.Reqsync.Mapper.HelpRequestMapper;
import com.reqsync.Reqsync.Repository.HelpRequestRepository;
import com.reqsync.Reqsync.Repository.RoleRepository;
import com.reqsync.Reqsync.Repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EncoderConfig passwordEncoder;

    @Autowired
    private HelpRequestRepository helpRequestRepository;

    @Autowired
    private HelpRequestMapper helpRequestMapper;

    @Transactional
    public User addDaoUser(User user) {
        Optional<User> userInstanceOptional = userRepository.findByEmail(user.getEmail());
        userInstanceOptional.ifPresent(x -> {
            throw new AlreadyUsedEmail("The email is already present try with something else");
        });
        if (user.getRoles() == null) { // This checks first that the role field is null
            Roles roleId = roleRepository.findByRole("USER");
            user.setRoles(List.of(roleId));
        }

        user.setEmail(user.getEmail());
        user.setPassword(passwordEncoder.passwordEncoder().encode(user.getPassword()));
        userRepository.save(user);
        return user;
    }

    @Transactional
    public User addUser(UserDto userDao) {
        Optional<User> existingUser = userRepository.findByEmail(userDao.getEmail());
        existingUser.ifPresent(u -> {
            throw new AlreadyUsedEmail("The email is already present, try with something else");
        });

        User user = new User();
        user.setEmail(userDao.getEmail());
        user.setPassword(passwordEncoder.passwordEncoder().encode(userDao.getPassword()));

        // Restrict roles: Always assign "USER" role for new signups
        Roles defaultRole = roleRepository.findByRole("USER");
        if (defaultRole == null) {
            throw new RuntimeException("Default 'USER' role does not exist");
        }
        user.setRoles(List.of(defaultRole)); // Assign only the "USER" role

        userRepository.save(user);
        return user;
    }

    public UserProfileDto getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsersNotFound("User not found with email: " + email));

        // Check user roles
        boolean isVolunteer = user.getRoles().stream().anyMatch(role -> role.getRole().equalsIgnoreCase("VOLUNTEER"));
        boolean isHelpRequester = user.getRoles().stream()
                .anyMatch(role -> role.getRole().equalsIgnoreCase("HELPREQUESTER"));

        List<String> roles = user.getRoles().stream()
                .map(Roles::getRole) // Assuming Roles entity has a `getRole()` method
                .collect(Collectors.toList());

        List<?> helpRequests = new ArrayList<>();

        if (isVolunteer) {
            // Fetch all help requests
            helpRequests = helpRequestRepository.findAll()
                    .stream()
                    .map(helpRequestMapper::toVolunterrDto)
                    .collect(Collectors.toList());
        } else if (isHelpRequester) {
            // Fetch only the user's help requests
            helpRequests = user.getHelpRequests()
                    .stream()
                    .map(helpRequestMapper::toRequestDto)
                    .collect(Collectors.toList());
        }

        return UserProfileDto.builder()
                .email(user.getEmail())
                .roles(roles)
                .name(user.getName())
                .phone(user.getPhone())
                .area(user.getArea())
                .bio(user.getBio())
                .profilePicture(
                        user.getProfilePicture() != null ? Base64.getEncoder().encodeToString(user.getProfilePicture())
                                : null)
                .helpRequests(helpRequests)
                .build();
    }

    @Transactional
    public UserProfileDto updateUserProfile(MultipartFile profilePicture, UserUpdateDto updateDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsersNotFound("User not found with email: " + email));

        // Update user details if provided
        if (updateDto.getName() != null)
            user.setName(updateDto.getName());
        if (updateDto.getPhone() != null)
            user.setPhone(updateDto.getPhone());
        if (updateDto.getArea() != null)
            user.setArea(updateDto.getArea());
        if (updateDto.getBio() != null)
            user.setBio(updateDto.getBio());

        // Update profile picture if a new one is provided
        if (profilePicture != null && !profilePicture.isEmpty()) {
            try {
                // Check if the user has no profile picture OR wants to update it
                if (user.getProfilePicture() == null || profilePicture.getSize() > 0) {
                    user.setProfilePicture(profilePicture.getBytes());
                }
            } catch (IOException e) {
                throw new ImageNotSaved("The Image is not saved because of this error: " + e.getMessage());
            }
        }
        userRepository.save(user);

        return UserProfileDto.builder()
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .area(user.getArea())
                .bio(user.getBio())
                .profilePicture(
                        user.getProfilePicture() != null ? Base64.getEncoder().encodeToString(user.getProfilePicture())
                                : null)
                .roles(user.getRoles().stream().map(Roles::getRole).collect(Collectors.toList()))
                .build();
    }

    public boolean deleteUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsersNotFound("User not found with email: " + email));

        try {
            userRepository.delete(user);
            return true;
        } catch (Exception e) {
            return false;
        }

    }

    public boolean userNotExist(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isEmpty(); // Return true if user does not exist
    }

}