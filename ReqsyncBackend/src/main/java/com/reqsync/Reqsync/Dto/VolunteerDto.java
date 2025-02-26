package com.reqsync.Reqsync.Dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class VolunteerDto {

    @Null(message = "Name is required.")
    private String name;

    @Null(message = "Phone number is required.")
    private String phone;

    @Null(message = "Area is required.")
    private String area;

    @NotBlank(message = "About should Not Blank.")
    private String about;
}
