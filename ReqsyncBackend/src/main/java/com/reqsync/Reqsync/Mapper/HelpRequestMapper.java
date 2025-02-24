package com.reqsync.Reqsync.Mapper;

import org.springframework.stereotype.Component;

import com.reqsync.Reqsync.Dto.HelpRequestForRequestorDto;
import com.reqsync.Reqsync.Dto.HelpRequestForVolunteerDto;
import com.reqsync.Reqsync.Entity.HelpRequest;

@Component
public class HelpRequestMapper {

    // Convert HelpRequest entity to HelpRequestDto
    public HelpRequestForRequestorDto toRequestDto(HelpRequest helpRequest) {
        return HelpRequestForRequestorDto.builder()
                .id(helpRequest.getId())
                .name(helpRequest.getName())
                .phone(helpRequest.getPhone())
                .area(helpRequest.getArea())
                .helpType(helpRequest.getHelpType())
                .message(helpRequest.getMessage())
                .isResolved(helpRequest.isResolved())
                .build();
    }

    public HelpRequestForVolunteerDto toVolunterrDto(HelpRequest helpRequest) {
        return HelpRequestForVolunteerDto.builder()
                .id(helpRequest.getId())
                .name(helpRequest.getName())
                .phone(helpRequest.getPhone())
                .area(helpRequest.getArea())
                .helpType(helpRequest.getHelpType())
                .message(helpRequest.getMessage())
                .requestStatus(helpRequest.getStatus().toString())
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
