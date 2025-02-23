package com.reqsync.Reqsync.CustomException;

public class VolunteerAccessed extends RuntimeException {
    public VolunteerAccessed(String message) {
        super(message);
    }
}
