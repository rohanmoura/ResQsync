package com.reqsync.Reqsync.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.reqsync.Reqsync.Dto.NewsDto;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NewsService {

    @Value("${newsapi.key}")
    private String apiKey;

    @Value("${newsapi.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<NewsDto> getPandemicNews() {
        String url = apiUrl + "?q=pandemic OR disease OR virus&apiKey=" + apiKey;

        ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                url, HttpMethod.GET, null, new ParameterizedTypeReference<>() {
                });

        Map<String, Object> response = responseEntity.getBody();

        if (response != null && response.containsKey("articles")) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> articles = (List<Map<String, Object>>) response.get("articles");

            return articles.stream()
                    .map(article -> new NewsDto(
                            getStringOrDefault(article.get("title"), "No title available"),
                            getStringOrDefault(article.get("description"), "No description available"),
                            getStringOrDefault(article.get("url"), "#"),
                            getStringOrDefault(article.get("urlToImage"), "#"), // If no image, return null
                            getStringOrDefault(article.get("content"), "No content available")))
                    .collect(Collectors.toList());
        }

        return List.of(); // Return empty list if any error occurs
    }

    private String getStringOrDefault(Object value, String defaultValue) {
        return value instanceof String ? (String) value : defaultValue; // if the instance of the value is a string
                                                                        // return the value else return the default
                                                                        // value
    }
}
