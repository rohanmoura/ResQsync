package com.reqsync.Reqsync.Dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
@AllArgsConstructor
@Getter
@Setter
public class UserProfileDto {
    private String email;
    private String name;
    private String phone;
    private String area;
    private String bio;
    private String profilePicture; // Store as a Base64 string for easy transfer
    private List<String> roles;
    private List<?> helpRequests;
}
