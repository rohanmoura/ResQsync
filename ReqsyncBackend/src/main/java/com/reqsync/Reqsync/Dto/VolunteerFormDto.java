package com.reqsync.Reqsync.Dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class VolunteerFormDto {

    @NotEmpty(message = "At least one volunteering type is required.")
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY) // Allows single values as arrays
    private List<VolunterrTypes> volunteeringTypes; // Example: ["MEDICAL_ASSISTANCE", "PATIENT_SUPPORT",
                                                    // "ADMINISTRATIVE_SUPPORT"]

    private List<String> skills; // Example: ["First Aid", "Public Speaking", "Software Development"]

    @NotBlank(message = "About is required.")
    @Size(max = 10000, message = "About section must be less than 1000 characters.")
    private String about;
}
