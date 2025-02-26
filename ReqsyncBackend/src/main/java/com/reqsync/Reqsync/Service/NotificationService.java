package com.reqsync.Reqsync.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.yaml.snakeyaml.emitter.EmitterException;

import com.reqsync.Reqsync.Dto.NotificationDto;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService {

    private final Map<String, SseEmitter> sseEmitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(String email) {
        SseEmitter emitter = new SseEmitter(3600000L); // 1 hour timeout
        sseEmitters.put(email, emitter);

        emitter.onCompletion(() -> {
            sseEmitters.remove(email);
        });
        emitter.onTimeout(() -> {
            sseEmitters.remove(email);
        });
        return emitter;
    }

    public void sendNotification(String email, NotificationDto notification) {
        SseEmitter emitter = sseEmitters.get(email);
        if (emitter != null) {
            try {
                // emitter.send(SseEmitter.event()
                // .name("notification")
                // .data(notification));
                emitter.send(notification);
            } catch (IOException e) {
                emitter.completeWithError(e);
                sseEmitters.remove(email);
            }
        } else {
            throw new EmitterException("No emitter found for : " + email);
        }
    }
}