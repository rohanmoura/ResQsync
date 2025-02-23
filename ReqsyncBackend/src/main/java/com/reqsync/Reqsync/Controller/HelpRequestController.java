package com.reqsync.Reqsync.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.reqsync.Reqsync.Dto.HelpRequestDto;
import com.reqsync.Reqsync.Service.HelpRequestService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@PreAuthorize("hasAuthority('USER')")
@RequestMapping("/api/help-requests")
public class HelpRequestController {

    @Autowired
    private HelpRequestService helpRequestService;

    /**
     * Endpoint to submit a new help request with validation.
     */
    @PostMapping("/submit")
    public ResponseEntity<String> submitHelpRequest(@Valid @RequestBody HelpRequestDto helpRequestDto,
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
            helpRequestService.addHelpRequest(helpRequestDto);
            return new ResponseEntity<>("Help request submitted successfully!", HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/deletehelprequestorrole")
    public ResponseEntity<String> deleteVolunteer(@RequestParam String email) {
        try {
            helpRequestService.deleteHelpRequestorRole(email);
            return new ResponseEntity<>("HelpRequestorrole deleted successfully!", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
