package com.reqsync.Reqsync.JwtConfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.reqsync.Reqsync.Model.AuthRequest;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException, java.io.IOException {
        UserDetails user = (UserDetails) authentication.getPrincipal();

        AuthRequest authRequest = new AuthRequest(user.getUsername(), user.getPassword());

        String token = jwtService.authentication(authRequest.getEmail() , authRequest.getPassword()); // Generate JWT for authenticated user
        response.setHeader("Authorization", "Bearer " + token); // Return JWT in response header
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write("{\"message\": \"Login successful\", \"token\": \"" + token + "\"}");
    }
}
