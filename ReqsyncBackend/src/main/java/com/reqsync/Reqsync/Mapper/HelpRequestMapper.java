package com.reqsync.Reqsync.Mapper;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.reqsync.Reqsync.Dto.HelpRequestForRequestorDto;
import com.reqsync.Reqsync.Dto.HelpRequestForVolunteerDto;
import com.reqsync.Reqsync.Dto.HelpRequestFormDto;
import com.reqsync.Reqsync.Dto.HelpRequestInfoDto;
import com.reqsync.Reqsync.Dto.HelpRequestorProfileDto;
import com.reqsync.Reqsync.Entity.HelpRequest;

@Component
public class HelpRequestMapper {

    // Convert HelpRequest entity to HelpRequestDto
    public HelpRequestorProfileDto toRequestDto(HelpRequest helpRequest) {
        return HelpRequestorProfileDto.builder()
                .id(helpRequest.getId())
                .name(helpRequest.getName())
                .phone(helpRequest.getPhone())
                .area(helpRequest.getArea())
                .helpRequestsList(List.of(new HelpRequestInfoDto()))
                .build();
    }

    public HelpRequestorProfileDto toVolunteerDto(HelpRequest helpRequest) {

        List<String> roles = helpRequest.getUser().getRoles()
                .stream()
                .map(role -> role.getRole()) // Adjust this method if your field/method is named differently.
                .collect(Collectors.toList());

        HelpRequestInfoDto helpInfo = HelpRequestInfoDto.builder()
                .id(helpRequest.getId())
                .resolved(helpRequest.isResolved()) // Use appropriate getter for resolved status
                .status(helpRequest.getStatus()) // Adjust if getStatus() returns an enum or object
                .build();

        return HelpRequestorProfileDto.builder()
                .id(helpRequest.getId())
                .email(helpRequest.getUser().getEmail())
                .name(helpRequest.getName())
                .phone(helpRequest.getPhone())
                .area(helpRequest.getArea())
                .roles(roles)
                .helpRequestsList(Collections.singletonList(helpInfo)) // can use list.of as well
                .build();
    }

    // // Convert HelpRequestDto to HelpRequest entity
    // public HelpRequest toEntity(HelpRequestDto helpRequestDto) {
    // return HelpRequest.builder()
    // .id(helpRequestDto.getId())
    // .name(helpRequestDto.getName())
    // .phone(helpRequestDto.getPhone())
    // .area(helpRequestDto.getArea())
    // .helpType(helpRequestDto.getHelpType())
    // .message(helpRequestDto.getMessage())
    // .build();
    // }
}
