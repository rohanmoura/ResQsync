package com.reqsync.Reqsync.GlobalException;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.reqsync.Reqsync.CustomException.AlreadyUsedEmail;
import com.reqsync.Reqsync.CustomException.MessageNotSended;
import com.reqsync.Reqsync.CustomException.NoHeader;
import com.reqsync.Reqsync.CustomException.NoRowsFound;
import com.reqsync.Reqsync.CustomException.NoTableFound;
import com.reqsync.Reqsync.CustomException.UsersNotFound;
import com.reqsync.Reqsync.CustomException.ValidationException;
import com.reqsync.Reqsync.CustomException.WrongAuthenticationCredentials;

@RestControllerAdvice
public class RestGlobaladvice {

    @ExceptionHandler(AlreadyUsedEmail.class)
    public ResponseEntity<Map<String, String>> handleUserAlreadyExistsException(AlreadyUsedEmail ex) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("Error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMap);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("Error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMap); // Or use an appropriate status code
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(ValidationException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Validation errors occurred");
        response.put("errors", ex.getErrors());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(WrongAuthenticationCredentials.class)
    public ResponseEntity<Map<String, Object>> handleWrongAuthenticationCredentials(WrongAuthenticationCredentials ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(UsersNotFound.class)
    public ResponseEntity<Map<String, Object>> handleUsersNotFound(UsersNotFound ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(NoTableFound.class)
    public ResponseEntity<Map<String, Object>> handleNotTableFound(NoTableFound ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(NoRowsFound.class)
    public ResponseEntity<Map<String, Object>> handleNoRoFound(NoRowsFound ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(NoHeader.class)
    public ResponseEntity<Map<String, Object>> handleNoHeader(NoHeader ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(MessageNotSended.class)
    public ResponseEntity<Map<String, Object>> handleMessageNotSended(MessageNotSended ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

}
