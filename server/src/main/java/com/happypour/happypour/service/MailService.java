package com.happypour.happypour.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    @Value("${SPRING_APP_ADDRESS}")
    private String SPRING_APP_ADDRESS;
    private JavaMailSender javaMailSender;

    public void sendRegisterLink(String token, String emailAddress) {
        String to = emailAddress;
        String subject = "Registration request";
        String text = "Hi!\n" +
                "A user registration request was made with your email!\n" +
                "Click here to register your user: " + SPRING_APP_ADDRESS + "/auth/verify/" + token;
        sendEmail(to,subject,text);
    }

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(to);
        email.setSubject(subject);
        email.setText(text);
        javaMailSender.send(email);
    }
}
