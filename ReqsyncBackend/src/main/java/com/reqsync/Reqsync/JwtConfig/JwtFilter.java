package com.reqsync.Reqsync.JwtConfig;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter { // This will run once before a request
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization"); // Getting the header
        String username = null;
        String jwt = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) { // Checking the header that the
                                                                                        // header is not null \
                                                                                        // and also starts with the
                                                                                        // Bearer
            jwt = authorizationHeader.substring(7); // this will return the jwt tokenn after cuttibng the bearee string
            username = jwtUtil.extractUsername(jwt); // This will extract the username or email in our case . this
                                                     // method is dfefined in jwt util
        }
        if (username != null) { // If the username is not null then it will extract the userdetsils from the
                                // loadusername method like the name , password and the authorities
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt)) { // This will validate the token like the expiry
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails,
                        userDetails.getPassword(),
                        userDetails.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth); // Setting the auth for the upcoming filters
                                                                            // to check that the user is authenticated
                                                                            // or not
            }
        }
        chain.doFilter(request, response); // Sending the request and the response to upcoming filters
    }
}