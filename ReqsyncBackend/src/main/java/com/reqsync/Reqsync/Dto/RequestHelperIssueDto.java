package com.reqsync.Reqsync.Dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.NotBlank;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class RequestHelperIssueDto {

    public Long id;
    @NotBlank(message = "Description is required.")
    @Size(max = 1000, message = "Description must be less than 1000 characters.")
    public String description;
    public String volunteerEmail;
    public String reportedAt;
}
