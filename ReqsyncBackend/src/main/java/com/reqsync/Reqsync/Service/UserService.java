package com.reqsync.Reqsync.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reqsync.Reqsync.Config.EncoderConfig;
import com.reqsync.Reqsync.CustomException.AlreadyUsedEmail;
import com.reqsync.Reqsync.Dto.UserDTO;
import com.reqsync.Reqsync.Entity.Roles;
import com.reqsync.Reqsync.Entity.User;
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
    public User addUser(UserDTO userDTO) {
        Optional<User> existingUser = userRepository.findByEmail(userDTO.getEmail());
        existingUser.ifPresent(u -> {
            throw new AlreadyUsedEmail("The email is already present, try with something else");
        });

        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.passwordEncoder().encode(userDTO.getPassword()));

        // Restrict roles: Always assign "USER" role for new signups
        Roles defaultRole = roleRepository.findByRole("USER");
        if (defaultRole == null) {
            throw new RuntimeException("Default 'USER' role does not exist");
        }
        user.setRoles(List.of(defaultRole)); // Assign only the "USER" role

        userRepository.save(user);
        return user;
    }
    
    public boolean userNotExist(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isEmpty();  // Return true if user does not exist
    }


 
}