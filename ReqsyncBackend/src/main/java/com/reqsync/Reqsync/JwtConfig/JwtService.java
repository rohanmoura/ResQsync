package com.reqsync.Reqsync.JwtConfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import com.reqsync.Reqsync.CustomException.WrongAuthenticationCredentials;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtService {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    public String authentication(String email, String password) {
        try {
            if (password != null) {
                // Standard authentication
                org.springframework.security.core.Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                String jwtToken = jwtUtil.generateToken(userDetails);

                if (authentication.isAuthenticated()) {
                    return jwtToken;
                } else {
                    throw new WrongAuthenticationCredentials("Please sign up first!");
                }
            } else {
                // OAuth2 login, no password required
                UserDetails userDetails = userDetailsService.loadUserByUsername(email); // No need to check for the password of the user directly give the access 
                if (userDetails == null) {
                    throw new RuntimeException("User not found for email: " + email);
                }
                // Directly generate JWT
                return jwtUtil.generateToken(userDetails);
            }
        } catch (Exception e) {
            throw new RuntimeException("Something might be wrong in email or password", e);
        }
    }

}
