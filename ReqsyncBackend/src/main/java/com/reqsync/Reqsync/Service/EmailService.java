package com.reqsync.Reqsync.Service;

import java.time.LocalDateTime;

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

    public void sendRequestFulfilledEmail(String requestorEmail, String requestorName,
            String volunteerName, String helpType,
            LocalDateTime fulfilledTime) {
        String subject = "Your Help Request Has Been Fulfilled! 🎉";

        String message = """
                <html>
                <body>
                    <p>Dear %s,</p>
                    <p>We are happy to inform you that your help request for <strong>%s</strong> has been fulfilled by <strong>%s</strong>.</p>

                    <h4>Request Details:</h4>
                    <ul>
                        <li><b>Help Type:</b> %s</li>
                        <li><b>Fulfilled On:</b> %s</li>
                    </ul>

                    <p>We hope your issue has been resolved to your satisfaction. If there is anything else you need assistance with, feel free to reach out.</p>

                    <p><a href="https://yourwebsite.com/confirm-request"
                          style="padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 5px;">
                          Confirm Request Completion
                       </a></p>

                    <p>Thank you for using our platform to connect with volunteers. We appreciate your trust!</p>

                    <p>Best regards,</p>
                    <p><strong>The ReqSync Team</strong></p>
                </body>
                </html>
                """
                .formatted(requestorName, helpType, volunteerName, helpType, fulfilledTime);

        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(requestorEmail);
            helper.setSubject(subject);
            helper.setText(message, true); // true for HTML content
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
