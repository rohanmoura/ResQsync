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

    /// An SseEmitter is a Spring Framework class designed for Server-Sent Events
    /// (SSE). It acts as a bridge between your server and client by holding an HTTP
    /// connection open so the server can push updates to the client in real time.

    private final Map<String, SseEmitter> sseEmitters = new ConcurrentHashMap<>(); /// A thread-safe ConcurrentHashMap
                                                                                   /// that stores active SSE
                                                                                   /// connections.

    public SseEmitter subscribe(String email) {
        SseEmitter emitter = new SseEmitter(3600000L); // 1 hour timeout
        sseEmitters.put(email, emitter);
        System.out.println("The user : " + email + " has been subscribed");
        emitter.onCompletion(() -> {
            sseEmitters.remove(email); /// Removes the emitter from the map when the connection is closed.
        });
        emitter.onTimeout(() -> {
            sseEmitters.remove(email); // Removes the emitter from the map when the connection times out.
        });
        return emitter;
    }

    public void sendNotification(String email, NotificationDto notification) {
        SseEmitter emitter = sseEmitters.get(email); /// Retrieves the emitter for the given email from the map.
        if (emitter != null) {
            try {
                // emitter.send(SseEmitter.event()
                // .name("notification")
                // .data(notification));
                emitter.send(notification); /// Sends the notification to the client using the emitter.
            } catch (IOException e) {
                emitter.completeWithError(e);
                sseEmitters.remove(email); /// Removes the emitter from the map if an error occurs.
            }
        } else {
            throw new EmitterException("No emitter found for : " + email);
        }
    }
}