package com.reqsync.Reqsync.CustomException;

public class AlreadyHaveRole extends RuntimeException {
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    public AlreadyHaveRole(String message) {
        super(message);
    }

}
