package com.reqsync.Reqsync.Dto;

import java.util.List;

import com.reqsync.Reqsync.Entity.HelpRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VolunteerProfileDto {

    private String email;
    private String name;
    private String phone;
    private String area;
    private String bio;
    private String profilePicture; // Store as a Base64 string for easy transfer
    private List<String> roles;
    private List<?> helpRequests;
    private List<String> volunteeringTypes; // Example: ["MEDICAL_ASSISTANCE", "PATIENT_SUPPORT",
    private List<String> skills; // Example: ["First Aid", "Public Speaking", "Software Development"]
    private String about;
}
