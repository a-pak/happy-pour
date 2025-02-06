package com.happypour.happypour;

import com.happypour.happypour.model.*;
import com.happypour.happypour.model.embeddable.HappyHourDrinkId;
import com.happypour.happypour.repository.*;

import java.sql.Time;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class HappypourApplication{

	@Autowired
	private BarRepository barRepository;
    @Autowired
    private DrinkRepository drinkRepository;
    @Autowired
    private HappyHourRepository happyHourRepository;
    @Autowired
    private HappyHourDrinkRepository happyHourDrinkRepository;

	public static void main(String[] args) {
		SpringApplication.run(HappypourApplication.class, args);
	}

    @Bean
    public CommandLineRunner demo(BarRepository barRepository, UserRepository user) {
        return (args) -> {
            User user1 = new User(null, "admin", "salasana", "admin@example.com");
            User user2 = new User(null, "moderator", "salasana", "moderator@example.com");

            user.save(user1);
            user.save(user2);
            Bar bar1 = new Bar(null, "Bar Helsinki", 24.9384, 60.1699, "Mannerheimintie 1", LocalTime.of(14, 30), LocalTime.of(14, 30), 0, 0, user1, user2, null, null);

            barRepository.save(bar1);
            barRepository.save(new Bar(null, "Bar Tampere", 23.7610, 61.4978, "Hämeenkatu 10", LocalTime.of(14, 30), LocalTime.of(14, 30), 0, 0, user2, user1, null, null));
            barRepository.save(new Bar(null, "Bar Turku", 22.2666, 60.4518, "Aurakatu 5", LocalTime.of(14, 30), LocalTime.of(14, 30), 0, 0, user1, user1, null, null));
            barRepository.save(new Bar(null, "Bar Oulu", 25.4666, 65.0124, "Rotuaari 3", LocalTime.of(14, 30), LocalTime.of(14, 30), 0, 0, user2, user2, null, null));

            Drink drink1 = new Drink(null, "Draft Beer", bar1, 5.50, user1, user1, null, null);
            Drink drink2 = new Drink(null, "Cocktail", bar1, 9.00, user1, user2, null, null);
            Drink drink3 = new Drink(null, "Wine", bar1, 7.50, user2, user2, null, null);

            drinkRepository.save(drink1);
            drinkRepository.save(drink2);
            drinkRepository.save(drink3);

            HappyHour hh1 = new HappyHour(null, bar1, LocalTime.of(12, 30), LocalTime.of(13, 30),user1, user1, null, null);
            happyHourRepository.save(hh1);

            HappyHourDrink happyHourDrink = new HappyHourDrink(new HappyHourDrinkId(hh1, drink1),hh1,drink1, 0.5,user1, user1, null, null);
            happyHourDrinkRepository.save(happyHourDrink);

            barRepository.findAll().forEach(bar -> System.out.println(bar));
        };
    }
}
