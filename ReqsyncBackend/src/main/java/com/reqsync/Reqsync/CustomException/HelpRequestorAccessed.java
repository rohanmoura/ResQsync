package com.reqsync.Reqsync.CustomException;

public class HelpRequestorAccessed extends RuntimeException {
    public HelpRequestorAccessed(String message) {
        super(message);
    }
}
