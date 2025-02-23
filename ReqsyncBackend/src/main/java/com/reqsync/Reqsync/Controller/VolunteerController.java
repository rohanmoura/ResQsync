package com.reqsync.Reqsync.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.reqsync.Reqsync.Dto.VolunteerDto;
import com.reqsync.Reqsync.Service.EmailService;
import com.reqsync.Reqsync.Service.VolunteerService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@PreAuthorize("hasAuthority('USER')")
@RequestMapping("/api/volunteers")
public class VolunteerController {

    @Autowired
    private VolunteerService volunteerService;

    @Autowired
    private EmailService emailService;

    /**
     * Endpoint to add a new volunteer with validation.
     */
    @PostMapping("/add")
    public ResponseEntity<String> addVolunteer(@Valid @RequestBody VolunteerDto volunteerDto,
            BindingResult bindingResult) {
        // Check for validation errors
        if (bindingResult.hasErrors()) {
            // Collect all errors into a list of strings
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.toList());
            return new ResponseEntity<>(String.join(", ", errors), HttpStatus.BAD_REQUEST);
        }

        try {
            volunteerService.addVolunteer(volunteerDto);
            emailService.sendVolunteerWelcomeEmail(volunteerDto.getEmail(), volunteerDto.getName());
            return new ResponseEntity<>("Volunteer added successfully!", HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while adding the volunteer.",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deletevolunteerrole")
    public ResponseEntity<String> deleteVolunteer(@RequestParam String email) {
        try {
            volunteerService.deleteVolunteerRole(email);
            return new ResponseEntity<>("Volunteer deleted successfully!", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
