package com.reqsync.Reqsync.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HelpRequestFormDto {

    @NotBlank(message = "The Help type should not be blank")
    private String helpType;

    @NotBlank(message = "The description of the help should not be blank")
    @Size(min = 1, max = 10000, message = "The description should be less then 10000 and more then 1")
    private String description;
}
