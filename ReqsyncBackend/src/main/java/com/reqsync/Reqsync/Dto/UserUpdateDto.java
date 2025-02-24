package com.reqsync.Reqsync.Dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserUpdateDto {
    @NotBlank(message = "Name cannot be blank")
    private String name;

    @Pattern(regexp = "^[6789]\\d{9}$", message = "Invalid Indian phone number. Must start with 6, 7, 8, or 9 and be 10 digits long.")
    private String phone;

    private String area;
    private String bio;
}
