package com.reqsync.Reqsync.Events;

import com.reqsync.Reqsync.Entity.HelpRequest;
import com.reqsync.Reqsync.Entity.Volunteer;
import com.reqsync.Reqsync.Repository.VolunteerRepository;
import com.reqsync.Reqsync.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import java.util.List;

///An Event Listener waits for an event to be published and performs some action when it occurs.
///Here, HelpRequestEventListener listens for HelpRequestCreatedEvent and sends emails to all volunteers when a new help request is created.
@Component
public class HelpRequestEventListener {

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private EmailService emailService;

    @Async /// Runs this method in the background to prevent blocking the main thread while
           /// sending emails to all volunteers in the database at once when a new help
           /// request is created in the system.
    @EventListener // This method listens for HelpRequestCreatedEvent events.
    public void onHelpRequestCreated(HelpRequestCreatedEvent event) {
        HelpRequest helpRequest = event.getHelpRequest();
        List<Volunteer> volunteers = volunteerRepository.findAll();

        volunteers.forEach(volunteer -> {
            emailService.sendHelpRequestEmail(helpRequest, volunteer.getUser().getEmail(), volunteer.getName());
        });
    }
}
