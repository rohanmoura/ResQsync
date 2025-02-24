package com.reqsync.Reqsync.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Size;
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
public class VolunteerDto {

    @NotBlank(message = "Name is required.")
    @Size(max = 50, message = "Name must be less than 50 characters.")
    private String name;

    @NotBlank(message = "Phone number is required.")
    @Size(max = 15, message = "Phone number must be less than 15 characters.")
    private String phone;

    @NotBlank(message = "Area is required.")
    @Size(max = 100, message = "Area name must be less than 100 characters.")
    private String area;

    @Null(message = "About should not be provided.")
    private String about;
}
