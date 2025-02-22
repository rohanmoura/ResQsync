package com.reqsync.Reqsync.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class NewsService {

    @Value("${newsapi.key}")
    private String apiKey;

    @Value("${newsapi.url}")
    private String apiUrl;

    @Autowired
    private RestTemplate restTemplate;

    public Map<String, Object> getPandemicNews() {
        String url = apiUrl + "?q=pandemic OR disease OR virus&apiKey=" + apiKey;
        return restTemplate.exchange(url, HttpMethod.GET, null, new ParameterizedTypeReference<Map<String, Object>>() {
        }).getBody();
    }
}
