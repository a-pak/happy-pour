package com.happypour.happypour;

import com.happypour.happypour.dto.RegisterRequest;
import com.happypour.happypour.model.*;
import com.happypour.happypour.model.embeddable.HappyHourDrinkId;
import com.happypour.happypour.repository.*;

import java.time.LocalTime;

import com.happypour.happypour.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class HappypourApplication {
    public static void main(String[] args) {
        SpringApplication.run(HappypourApplication.class, args);
    }
}