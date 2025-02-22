package com.reqsync.Reqsync.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HelpRequestDto {

    @NotBlank(message = "Name is required.")
    @Size(max = 50, message = "Name must be less than 50 characters.")
    private String name;

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email format.")
    private String email;

    @NotBlank(message = "Phone number is required.")
    @Size(max = 15, message = "Phone number must be less than 15 characters.")
    private String phone;

    @NotBlank(message = "Area is required.")
    @Size(max = 100, message = "Area name must be less than 100 characters.")
    private String area;

    @NotBlank(message = "Help type is required.")
    @Size(max = 100, message = "Help type must be less than 100 characters.")
    private String helpType;

    @NotBlank(message = "Message is required.")
    private String message; // LOB data to handle large text
}
