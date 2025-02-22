package com.reqsync.Reqsync.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.reqsync.Reqsync.Dto.HelpRequestDto;
import com.reqsync.Reqsync.Service.HelpRequestService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/help-requests")
public class HelpRequestController {

    @Autowired
    private HelpRequestService helpRequestService;

    /**
     * Endpoint to submit a new help request with validation.
     */
    @PostMapping("/submit")
    public ResponseEntity<String> submitHelpRequest(@Valid @RequestBody HelpRequestDto helpRequestDto, BindingResult bindingResult) {
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
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while submitting the help request.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
