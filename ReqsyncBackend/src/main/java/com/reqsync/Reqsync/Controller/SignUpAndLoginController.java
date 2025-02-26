package com.reqsync.Reqsync.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reqsync.Reqsync.Dto.UserDto;
import com.reqsync.Reqsync.Entity.User;
import com.reqsync.Reqsync.JwtConfig.JwtService;
import com.reqsync.Reqsync.Model.AuthRequest;
import com.reqsync.Reqsync.Service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class SignUpAndLoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<User> signUp(@Valid @RequestBody UserDto userDao) {
        User user = userService.addUser(userDao);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {

        String jwt = jwtService.authentication(authRequest.getEmail(), authRequest.getPassword());
        return ResponseEntity.status(HttpStatus.OK)
                .header("Authorization", "Bearer " + jwt) // Add the token as a Bearer token
                .body("Login successful. JWT token added in the header." + jwt);

        // return ResponseEntity.ok(Map.of("token", jwt));
    }

}
