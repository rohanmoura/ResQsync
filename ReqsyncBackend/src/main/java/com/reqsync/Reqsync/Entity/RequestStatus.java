package com.reqsync.Reqsync.Entity;

import lombok.ToString;

@ToString
public enum RequestStatus {
    PENDING, // When the request is created
    RESOLVED // When successfully completed
}
