package com.reqsync.Reqsync.Events;

import com.reqsync.Reqsync.CustomException.UsersNotFound;
import com.reqsync.Reqsync.Dto.NotificationDto;
import com.reqsync.Reqsync.Entity.HelpRequest;
import com.reqsync.Reqsync.Entity.RequestHelperIssue;
import com.reqsync.Reqsync.Entity.User;
import com.reqsync.Reqsync.Entity.Volunteer;
import com.reqsync.Reqsync.Repository.HelpRequestRepository;
import com.reqsync.Reqsync.Repository.HelpRequestorIssueRepository;
import com.reqsync.Reqsync.Repository.UserRepository;
import com.reqsync.Reqsync.Repository.VolunteerRepository;
import com.reqsync.Reqsync.Service.EmailService;
import com.reqsync.Reqsync.Service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import java.util.List;

///An Event Listener waits for an event to be published and performs some action when it occurs.
///Here, HelpRequestEventListener listens for HelpRequestCreatedEvent and sends emails to all volunteers when a new help request is created.
@Component
public class EventListeners {

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private HelpRequestRepository helpRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HelpRequestorIssueRepository helpRequestorIssueRepository;

    @Autowired
    private NotificationService notificationService;

    @Async /// Runs this method in the background to prevent blocking the main thread while
           /// sending emails to all volunteers in the database at once when a new help
           /// request is created in the system.
    @EventListener // This method listens for HelpRequestCreatedEvent events.
    public void onHelpRequestCreated(HelpRequestCreatedEvent event) {
        HelpRequest helpRequest = event.getHelpRequest();
        List<Volunteer> volunteers = volunteerRepository.findAll();

        volunteers.forEach(volunteer -> {

            // Build and send SSE notification using the user's email
            NotificationDto notification = new NotificationDto();
            notification.setEmail(volunteer.getUser().getEmail());
            notification.setMessage("A new help request for " + helpRequest.getHelpType() + " has been posted.");
            notification.setTimestamp(System.currentTimeMillis());

            notificationService.sendNotification(volunteer.getUser().getEmail(), notification);

            emailService.sendHelpRequestEmail(helpRequest, volunteer.getUser().getEmail(), volunteer.getName());
        });
    }

    @Async
    @EventListener // This method listens for HelpRequestCreatedEvent events.
    public void onHelpRequestorIssue(HelpRequestorIssueCreatedEvent event) {
        RequestHelperIssue helpRequest = event.getHelpRequestorIssue();
        Long id = helpRequest.getId();
        RequestHelperIssue helperIssue = helpRequestorIssueRepository.findById(id)
                .orElseThrow(() -> new UsersNotFound("Help Request not found"));
        String email = helpRequest.getHelpIssuerEmail();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsersNotFound("User not found"));
        HelpRequest requestor = helpRequestRepository.findByUser(user)
                .orElseThrow(() -> new UsersNotFound("Help Request not found"));
        List<Volunteer> volunteers = volunteerRepository.findAll();

        volunteers.forEach(volunteer -> {
            emailService.sendRequestIssueReportedEmail(helperIssue, volunteer.getUser().getEmail(), requestor.getName(),
                    requestor.getHelpType(), helperIssue.getReportedAt(), helperIssue.getDescription(),
                    helperIssue.getVolunteerEmail());
        });
    }

}
