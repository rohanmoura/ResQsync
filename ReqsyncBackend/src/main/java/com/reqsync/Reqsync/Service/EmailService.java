package com.reqsync.Reqsync.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVolunteerWelcomeEmail(String toEmail, String volunteerName)
            throws MailException, MessagingException {
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

    }
}
