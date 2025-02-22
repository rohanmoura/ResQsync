package com.reqsync.Reqsync.Service;

import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reqsync.Reqsync.CustomException.UsersNotFound;
import com.reqsync.Reqsync.Entity.User;
import com.reqsync.Reqsync.Model.CustomUserDetails;
import com.reqsync.Reqsync.Repository.UserRepository;

@Service
// @Log4j2
public class UserDetailsServicImp implements UserDetailsService {

    private Logger log = LoggerFactory.getLogger(UserDetailsServicImp.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.debug("Entered in the loadername method");
        Optional<User> user = userRepository.findByEmail(email);
        User user2 = null;

        if (user.isEmpty()) {
            throw new UsersNotFound("User not found with email: " + email);
        }
        if (user.isPresent()) {
			user2 = user.get();
		}
        Collection<? extends GrantedAuthority> authorities = user.get().getRoles().stream()
                .map(authRoles -> new SimpleGrantedAuthority(authRoles.getRole()))
                .collect(Collectors.toList());

        return new CustomUserDetails(user.get().getEmail(), user.get().getPassword() , authorities , user2);
    }
}
