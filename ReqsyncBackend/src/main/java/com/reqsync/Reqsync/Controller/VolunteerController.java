package com.reqsync.Reqsync.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.reqsync.Reqsync.CustomException.WrongAuthenticationCredentials;
import com.reqsync.Reqsync.Dto.VolunteerFormDto;
import com.reqsync.Reqsync.Service.VolunteerService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/volunteers")
public class VolunteerController {

    @Autowired
    private VolunteerService volunteerService;

    /**
     * Endpoint to add a new volunteer with validation.
     */
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/add")
    public ResponseEntity<String> addVolunteer(@Valid @RequestBody VolunteerFormDto volunteerProfileDto) {
        try {
            volunteerService.addVolunteer(volunteerProfileDto);
            return new ResponseEntity<>("Volunteer added successfully!", HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('VOLUNTEER')")
    @DeleteMapping("/deletevolunteerrole")
    public ResponseEntity<String> deleteVolunteer(@RequestParam String email) {
        try {
            volunteerService.deleteVolunteerRole(email);
            return new ResponseEntity<>("Volunteer deleted successfully!", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('VOLUNTEER')")
    @PostMapping("/update")
    public ResponseEntity<?> updateVolunteer(@RequestBody VolunteerFormDto volunteerFormDto) {
        try {
            boolean updated = volunteerService.updateVolunteer(volunteerFormDto);
            if (updated) {
                return ResponseEntity.ok("Volunteer profile updated successfully.");
            } else {
                // Return a response indicating that no changes were made.
                return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                        .body("No changes made to volunteer profile.");
            }
        } catch (WrongAuthenticationCredentials ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred.");
        }
    }

    // @GetMapping("/volunterrdata")
    // public ResponseEntity<VolunteerFormDto> volunteerInfo() {
    // VolunteerFormDto volunteerProfileDto =
    // volunteerService.volunteerProfileInfo();
    // if (volunteerProfileDto == null) {
    // return ResponseEntity.noContent().build();
    // }
    // return new ResponseEntity<>(volunteerProfileDto, HttpStatus.OK);
    // }

}
