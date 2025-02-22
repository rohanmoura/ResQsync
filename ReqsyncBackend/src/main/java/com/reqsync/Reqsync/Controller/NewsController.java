package com.reqsync.Reqsync.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.reqsync.Reqsync.Service.NewsService;

import java.util.Map;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @GetMapping("/pandemic")
    public Map<String, Object> fetchPandemicNews() {
        return newsService.getPandemicNews();
    }
}
