package com.reqsync.Reqsync.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.reqsync.Reqsync.CustomException.MessageNotSended;
import com.reqsync.Reqsync.Entity.HelpRequest;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVolunteerWelcomeEmail(String toEmail, String volunteerName) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Welcome to ReqSync Volunteer Team!");
            helper.setText(
                    "<div style='font-family: Arial, sans-serif; padding: 10px;'>" +
                            "<h2>Hello " + volunteerName + ",</h2>" +
                            "<p>Thank you for joining our volunteer program! We are thrilled to have you on board.</p>"
                            +
                            "<p>At ReqSync, you can not only contribute to meaningful projects but also <strong>chat and collaborate</strong> with other volunteers.</p>"
                            +
                            "<p>To get started, log in to your account and connect with the team:</p>" +
                            "<br><br>" +
                            "<p>Looking forward to seeing you in action!</p>" +
                            "<br><p>Best Regards,</p>" +
                            "<p><strong>ReqSync Team</strong></p>" +
                            "</div>",
                    true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new MessageNotSended("Failed to send email.");
        }

    }

    public void sendHelpRequestEmail(HelpRequest helpRequest, String volunteerEmail, String volunteerName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(volunteerEmail);
            helper.setSubject("Urgent Help Request - " + helpRequest.getHelpType());
            helper.setText("<p>Dear " + volunteerName + ",</p>"
                    + "<p>You have received a new help request from someone in need. Below are the details:</p>"
                    + "<h2 style='color: #ff5733;'>Help Type: " + helpRequest.getHelpType() + "</h2>"
                    + "<p><strong>Requester's Name:</strong> " + helpRequest.getName() + "<br>"
                    + "<strong>Email:</strong> " + helpRequest.getUser().getEmail() + "<br>"
                    + "<strong>Phone Number:</strong> " + helpRequest.getPhone() + "<br>"
                    + "<strong>Location:</strong> " + helpRequest.getArea() + "</p>"
                    + "<h3>Message:</h3>"
                    + "<p>" + helpRequest.getMessage() + "</p>"
                    + "<p>Please reach out to them as soon as possible to provide the necessary assistance. Your support can make a real difference.</p>"
                    + "<p>Thank you for your kindness and dedication.</p>"
                    + "<p>Best regards,<br><strong>Reqsync Team</strong></p>", true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new MessageNotSended("Failed to send email.");
        }
    }
}
