package com.happypour.happypour;

import com.happypour.happypour.dto.RegisterRequest;
import com.happypour.happypour.model.*;
import com.happypour.happypour.model.embeddable.HappyHourDrinkId;
import com.happypour.happypour.repository.*;

import java.time.LocalTime;

import com.happypour.happypour.service.UserService;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class HappypourApplication{

    @Autowired
    UserService userService;
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
    public CommandLineRunner demo() {

        return (args) -> {
            userService.registerUser(new RegisterRequest("admin", "admin@example.com", "salasana"));
            userService.registerUser(new RegisterRequest("otso", "otso@example.com", "salasana"));

            User user1 = userService.getByEmail("admin@example.com");
            User user2 = userService.getByEmail("otso@example.com");

            // 60.1708297,24.9437718
            Bar bar1 = new Bar(
                    null,
                    "Molly Malone's",
                    24.9437718,
                    60.1708297,
                    "Mannerheimintie 1",
                    LocalTime.of(12, 00),
                    LocalTime.of(23, 30),
                    0,
                    0,
                    user1,
                    user1,
                    null,
                    null
            );
            barRepository.save(bar1);
            // 60.1714748,24.9496176
            Bar bar2 = new Bar(
                    null,
                    "Thirsty Scholar",
                    24.9496176,
                    60.1714748,
                    "Talontie 2",
                    LocalTime.of(12, 30),
                    LocalTime.of(1, 30),
                    0,
                    0,
                    user2,
                    user2,
                    null,
                    null
            );

            barRepository.save(bar1);
            barRepository.save(bar2);

            Drink drink1 = new Drink(null, "Beer", bar1, 7.30, user1, user1, null, null);
            Drink drink2 = new Drink(null, "Coffee", bar1, 2.00, user1, user2, null, null);
            Drink drink3 = new Drink(null, "Wine", bar2, 7.50, user2, user2, null, null);
            Drink drink4 = new Drink(null, "Beer", bar2, 7.30, user1, user1, null, null);

            drinkRepository.save(drink1);
            drinkRepository.save(drink2);
            drinkRepository.save(drink3);
            drinkRepository.save(drink4);

            HappyHour hh1 = new HappyHour(
                    null,
                    bar1,
                    LocalTime.of(9, 30),
                    LocalTime.of(23, 30),
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
