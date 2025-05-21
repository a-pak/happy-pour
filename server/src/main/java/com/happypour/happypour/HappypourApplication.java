package com.happypour.happypour;

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

    @Autowired
    EntityManager entityManager;

	public static void main(String[] args) {
		SpringApplication.run(HappypourApplication.class, args);
	}

    @Bean
    public CommandLineRunner demo() {

        return (args) -> {
            User user1 = User.builder()
                    .id(null)
                    .username("mattimeikalainen")
                    .email("matti.meikalainen@example.com")
                    .verified(true)
                    .password("salasana")
                    .build();
            userService.createUser(user1);

            User user2 = User.builder()
                    .id(null)
                    .username("otso")
                    .email("otso@example.com")
                    .verified(true)
                    .password("xcF9j_fief-_f3¤Ld*")
                    .build();
            userService.createUser(user2);

            // 60.1708297,24.9437718
            Bar bar1 = new Bar(
                    null,
                    "Molly Malone's",
                    24.9437718,
                    60.1708297,
                    "Mannerheimintie 1",
                    LocalTime.of(14, 30),
                    LocalTime.of(14, 30),
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
                    LocalTime.of(14, 30),
                    LocalTime.of(14, 30),
                    0,
                    0,
                    user2,
                    user2,
                    null,
                    null
            );
            barRepository.save(bar2);

            Drink drink1 = new Drink(null, "Beer", bar1, 7.30, user1, user1, null, null);
            Drink drink2 = new Drink(null, "Coffee", bar1, 2.00, user1, user2, null, null);
            Drink drink3 = new Drink(null, "Wine", bar2, 7.50, user2, user2, null, null);

            drinkRepository.save(drink1);
            drinkRepository.save(drink2);
            drinkRepository.save(drink3);

            HappyHour hh1 = new HappyHour(
                    null,
                    bar1,
                    LocalTime.of(10, 30),
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
