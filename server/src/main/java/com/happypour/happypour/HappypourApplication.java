package com.happypour.happypour;

import com.happypour.happypour.dto.RegisterRequest;
import com.happypour.happypour.model.*;
import com.happypour.happypour.model.embeddable.HappyHourDrinkId;
import com.happypour.happypour.repository.*;

import java.sql.Time;
import java.time.LocalTime;

import com.happypour.happypour.service.UserService;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class HappypourApplication{

    @Autowired
    UserRepository userRepository;
	@Autowired
	private BarRepository barRepository;
    @Autowired
    private DrinkRepository drinkRepository;
    @Autowired
    private HappyHourRepository happyHourRepository;
    @Autowired
    private HappyHourDrinkRepository happyHourDrinkRepository;

    @Autowired
    private UserService userService;

    @Autowired
    EntityManager entityManager;

	public static void main(String[] args) {
		SpringApplication.run(HappypourApplication.class, args);
	}

    @Bean
    public CommandLineRunner demo() {

        return (args) -> {
            userService.registerUser(new RegisterRequest("admin", "admin@example.com", "salasana"));
            userService.registerUser(new RegisterRequest("Matti", "matti@example.com", "salasana"));

            User user1 = userService.getByEmail("admin@example.com");
            User user2 = userService.getByEmail("matti@example.com");

            Bar bar1 = new Bar(
                    null,
                    "Bar Helsinki",
                    24.9384,
                    60.1699,
                    "Mannerheimintie 1",
                    LocalTime.of(14, 30),
                    LocalTime.of(14, 30),
                    0,
                    0,
                    user1,
                    user2,
                    null,
                    null
            );
            Bar bar2 = new Bar(
                    null,
                    "Ravintola Frendi",
                    24.9384,
                    60.2099,
                    "Talontie 2",
                    LocalTime.of(14, 30),
                    LocalTime.of(14, 30),
                    0,
                    0,
                    user2,
                    user2,
                    null,
                    null
            );

            barRepository.save(bar1);
            barRepository.save(bar2);

            Drink drink1 = new Drink(null, "Draft Beer", bar1, 5.50, user1, user1, null, null);
            Drink drink2 = new Drink(null, "Coffee", bar1, 2.00, user1, user2, null, null);
            Drink drink3 = new Drink(null, "Wine", bar2, 7.50, user2, user2, null, null);

            drinkRepository.save(drink1);
            drinkRepository.save(drink2);
            drinkRepository.save(drink3);

            HappyHour hh1 = new HappyHour(
                    null,
                    bar1,
                    LocalTime.of(12, 30),
                    LocalTime.of(13, 30),
                    user1,
                    user1,
                    null,
                    null
            );
            happyHourRepository.save(hh1); // detached entity passed to persist occurs here.

            HappyHourDrink happyHourDrink = new HappyHourDrink(
                    new HappyHourDrinkId(hh1, drink1),
                    hh1,
                    drink1,
                    3.80
                    ,user1,
                    user1,
                    null,
                    null
            );
            happyHourDrinkRepository.save(happyHourDrink);

            barRepository.findAll().forEach(bar -> System.out.println(bar));
        };
    }
}
