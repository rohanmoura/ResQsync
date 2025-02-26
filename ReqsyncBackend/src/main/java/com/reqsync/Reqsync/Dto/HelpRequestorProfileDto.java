package com.reqsync.Reqsync.Dto;

import java.util.List;

import com.reqsync.Reqsync.Entity.HelpRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Singular;
import lombok.ToString;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class HelpRequestorProfileDto {

    private Long id;
    private String email;
    private String name;
    private String phone;
    private String area;
    private String bio;
    private String profilePicture; // Store as a Base64 string for easy transfer
    private List<String> roles;
    private List<HelpRequestInfoDto> helpRequestsList;
}
