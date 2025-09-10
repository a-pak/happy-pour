package com.happypour.happypour.debug;

import java.time.LocalTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.happypour.happypour.service.UserService;
import com.happypour.happypour.repository.*;
import com.happypour.happypour.dto.RegisterRequest;
import com.happypour.happypour.model.*;
import com.happypour.happypour.model.embeddable.HappyHourDrinkId;

/**
 * This component runs a debug script after the application starts, if debug mode vmArgument is passed.
 * To enable debug mode, add the following VM argument when running the application:
 * -Ddebug.mode=true
 * 
 * 
 * The debug script will populate the database with sample data for testing purposes.
 */

@Component
public class DebugScriptRunner implements CommandLineRunner {
    @Value("${debug.mode:false}")
    private boolean debugMode;

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

    @Override
    public void run(String... args) {
        if (debugMode) {
            System.out.println("🔧 Running debug script after app startup...");
            runScript();
        }
    }

    private void runScript() {
        System.out.println(">>> Debug script is running.");
        userService.registerUser(new RegisterRequest("admin", "admin@example.com", "salasana"));
        userService.registerUser(new RegisterRequest("otso", "otso@example.com", "salasana"));
        User user1 = userService.getByEmail("admin@example.com");
        User user2 = userService.getByEmail("otso@example.com");

        // 60.1708297,24.9437718
        Bar bar1 = new Bar(
            null,
            "Tom Sawyer's",
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
            "Xanadu",
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
            3.80,
            user1,
            user1,
            null,
            null
        );
        happyHourDrinkRepository.save(happyHourDrink);

        barRepository.findAll().forEach(bar -> System.out.println(bar));
    }
}
