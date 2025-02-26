package com.reqsync.Reqsync.Dto;

import com.reqsync.Reqsync.Entity.RequestStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Assuming RequestStatus is an enum or a class already defined
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HelpRequestInfoDto {
    private Long id; // Help Request ID
    private Boolean resolved; // Indicates if the request is resolved
    private RequestStatus status; // The current status of the request
}
