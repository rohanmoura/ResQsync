package com.reqsync.Reqsync.CustomException;

import java.util.List;

public class ValidationException extends RuntimeException {

    private static final long serialVersionUID = 3489985341011675203L;

    private final List<String> errors;

    public ValidationException(List<String> errors) {
        super("Validation failed");
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }

}
