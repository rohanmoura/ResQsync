package com.reqsync.Reqsync.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NewsDto {
    private String title;
    private String description;
    private String url;
    private String urlToImage;
    private String content;
}
