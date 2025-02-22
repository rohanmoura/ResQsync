package com.reqsync.Reqsync.CustomException;

public class NoTableFound extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public NoTableFound(String message) {
        super(message);
    }

}
