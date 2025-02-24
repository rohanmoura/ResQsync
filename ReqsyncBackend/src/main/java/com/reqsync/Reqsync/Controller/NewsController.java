package com.reqsync.Reqsync.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.reqsync.Reqsync.Dto.NewsDto;
import com.reqsync.Reqsync.Service.NewsService;

import java.util.List;

@RestController
@RequestMapping("/api/news/pandemic")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @GetMapping
    public ResponseEntity<List<NewsDto>> fetchPandemicNews() {
        List<NewsDto> newsList = newsService.getPandemicNews();
        if (newsList.isEmpty()) {
            return ResponseEntity.noContent().build(); // Returns 204 No Content if empty
        }
        return ResponseEntity.ok(newsList); // Returns 200 OK
    }
}
