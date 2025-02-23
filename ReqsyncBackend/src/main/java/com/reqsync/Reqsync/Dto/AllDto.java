package com.reqsync.Reqsync.Dto;

import org.springframework.stereotype.Component;

import com.reqsync.Reqsync.Dao.HelpRequestDao;
import com.reqsync.Reqsync.Entity.HelpRequest;

@Component
public class AllDto {
    // Convert HelpRequest entity to HelpRequestDto
    public HelpRequestDao convertToHelpRequestDto(HelpRequest helpRequest) {
        return HelpRequestDao.builder()
                .id(helpRequest.getId())
                .name(helpRequest.getName())
                .phone(helpRequest.getPhone())
                .area(helpRequest.getArea())
                .helpType(helpRequest.getHelpType())
                .message(helpRequest.getMessage())
                .build();
    }
}
