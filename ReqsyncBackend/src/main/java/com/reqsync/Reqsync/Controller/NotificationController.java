package com.reqsync.Reqsync.Controller;

import com.reqsync.Reqsync.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
// @PreAuthorize("hasAuthority('VOLUNTEER')")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/api/notifications/subscribe")
    public SseEmitter subscribe(@RequestParam String email) {
        return notificationService.subscribe(email);
    }
}