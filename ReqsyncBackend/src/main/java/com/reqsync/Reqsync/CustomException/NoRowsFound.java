package com.reqsync.Reqsync.CustomException;

public class NoRowsFound extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public NoRowsFound(String message) {
        super(message);
    }

}
