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
import com.reqsync.Reqsync.CustomException.UsersNotFound;
import com.reqsync.Reqsync.Dao.HelpRequestDao;
import com.reqsync.Reqsync.Dao.UserDao;
import com.reqsync.Reqsync.Dao.UserProfileDao;
import com.reqsync.Reqsync.Dto.AllDto;
import com.reqsync.Reqsync.Entity.Roles;
import com.reqsync.Reqsync.Entity.User;
import com.reqsync.Reqsync.Repository.HelpRequestRepository;
import com.reqsync.Reqsync.Repository.RoleRepository;
import com.reqsync.Reqsync.Repository.UserRepository;

@Service
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
    private AllDto allDto;

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
    public User addUser(UserDao userDao) {
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

    public UserProfileDao getUserInfo() {
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

        List<HelpRequestDao> helpRequests = new ArrayList<>();

        if (isVolunteer) {
            // Fetch all help requests
            helpRequests = helpRequestRepository.findAll()
                    .stream()
                    .map(allDto::convertToHelpRequestDto)
                    .collect(Collectors.toList());
        } else if (isHelpRequester) {
            // Fetch only the user's help requests
            helpRequests = user.getHelpRequests()
                    .stream()
                    .map(allDto::convertToHelpRequestDto)
                    .collect(Collectors.toList());
        }

        return UserProfileDao.builder()
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
    public UserProfileDao updateUserProfile(MultipartFile profilePicture, UserProfileDao userProfileDto)
            throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsersNotFound("User not found with email: " + email));

        // Update user details if provided
        if (userProfileDto.getName() != null)
            user.setName(userProfileDto.getName());
        if (userProfileDto.getPhone() != null)
            user.setPhone(userProfileDto.getPhone());
        if (userProfileDto.getArea() != null)
            user.setArea(userProfileDto.getArea());
        if (userProfileDto.getBio() != null)
            user.setBio(userProfileDto.getBio());

        // Update profile picture if a new one is provided
        if (profilePicture != null && !profilePicture.isEmpty()) {
            user.setProfilePicture(profilePicture.getBytes());
        }

        // Save the updated user details
        userRepository.save(user);

        return UserProfileDao.builder()
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

    public boolean userNotExist(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isEmpty(); // Return true if user does not exist
    }

}