package com.happypour.happypour.service;
/* 
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import java.io.UnsupportedEncodingException;
*/
//@Service
public class MailService {
    /*
    @Value("${spring.app.address}")
    private String SPRING_APP_ADDRESS;

    @Value("${spring.mail.username}")
    private String fromAddress;

    //@Autowired
    private JavaMailSender javaMailSender;
    //@Autowired
    private TemplateEngine templateEngine;
    public void sendRegisterLink(String token, String emailAddress, String userName) {
        String verificationLink = SPRING_APP_ADDRESS + "/api/auth/verify/" + token;

        Context context = new Context();
        context.setVariable("verificationLink", verificationLink);
        context.setVariable("userName", userName);
        String htmlContent = templateEngine.process("email/verification-email.html", context);

        try {
            sendEmail(emailAddress, "Registration request", htmlContent);
        } catch (MessagingException | UnsupportedEncodingException exception) {
            // TODO: error handling in case mail can't be sent.
            System.err.print("Error sending email:\n" + exception);
        }
    }

    public void sendEmail(String to, String subject, String text) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromAddress, "Happy Pour");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text, true);

        javaMailSender.send(message);
    }*/
}