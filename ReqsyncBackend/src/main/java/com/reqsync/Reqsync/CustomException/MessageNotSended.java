package com.reqsync.Reqsync.CustomException;

public class MessageNotSended extends RuntimeException {
    public MessageNotSended(String message) {
        super(message);
    }

}
