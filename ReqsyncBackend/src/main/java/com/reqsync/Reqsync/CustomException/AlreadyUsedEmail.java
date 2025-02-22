package com.reqsync.Reqsync.CustomException;

public class AlreadyUsedEmail extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public AlreadyUsedEmail(String message) {
        super(message);
    }

}
