package com.happypour.happypour.debug;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalTime;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.happypour.happypour.service.UserService;
import com.happypour.happypour.repository.*;
import com.happypour.happypour.dto.RegisterRequest;
import com.happypour.happypour.model.*;
import com.happypour.happypour.model.enums.DrinkType;
import com.happypour.happypour.model.enums.WeekDay;

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
    private PriceRepository priceRepository;

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
        userService.registerUser(new RegisterRequest("baarimies", "baarimies@example.com", "salasana"));
        User user1 = userService.getByEmail("admin@example.com");
        User user2 = userService.getByEmail("baarimies@example.com");

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
            24.9488176,
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
        Bar bar3 = new Bar(
            null,
            "Limelight",
            24.9496196,
            60.1724648,
            "Tervatie 1",
            LocalTime.of(12, 30),
            LocalTime.of(1, 30),
            0,
            0,
            user2,
            user2,
            null,
            null
        );
        Bar bar4 = new Bar(
            null,
            "Bar 2112",
            24.9501196,
            60.1719768,
            "Teuvotie 1",
            LocalTime.of(12, 30),
            LocalTime.of(1, 30),
            0,
            0,
            user2,
            user2,
            null,
            null
        );
        Bar bar5 = new Bar(
            null,
            "Time Stand Still",
            24.9511196,
            60.1739768,
            "Turbotie 1",
            LocalTime.of(12, 30),
            LocalTime.of(1, 30),
            0,
            0,
            user2,
            user2,
            null,
            null
        );
        Bar bar6 = new Bar(
            null,
            "La Villa Strangiato",
            24.9521196,
            60.1749768,
            "Turbotie 1",
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
        barRepository.save(bar3);
        barRepository.save(bar4);
        barRepository.save(bar5);
        barRepository.save(bar6);

        Drink drink1 = Drink.builder()
            .name("Karhu III")
            .type(DrinkType.BEER)
            .createdBy(user2)
            .updatedBy(user2)
            .size((new BigDecimal(0.5)))
            .build();

        Drink drink2 = Drink.builder()
            .name("Karjala III")
            .type(DrinkType.BEER)
            .createdBy(user2)
            .updatedBy(user2)
            .size(new BigDecimal(0.5))
            .build();
        
        Drink drink3 = Drink.builder()
            .name("Gato Negro")
            .type(DrinkType.WINE)
            .createdBy(user2)
            .updatedBy(user2)
            .size((new BigDecimal(0.12)))
            .build();

        drinkRepository.save(drink1);
        drinkRepository.save(drink2);
        drinkRepository.save(drink3);

        HappyHour hh1 = HappyHour.builder()
            .bar(bar1)
            .startTime(LocalTime.of(1, 0))
            .endTime(LocalTime.of(23, 59))
            .weekDays(Set.of(WeekDay.MONDAY, WeekDay.WEDNESDAY, WeekDay.FRIDAY, WeekDay.SUNDAY))
            .createdBy(user1)
            .updatedBy(user1)
            .build();
        happyHourRepository.save(hh1); // detached entity passed to persist occurs here.

        Price price1 = Price.builder()
            .bar(bar2)
            .drink(drink2)
            .price(new BigDecimal(7.00).setScale(2, RoundingMode.UNNECESSARY))
            .createdBy(user2)
            .updatedBy(user1)
            .build();
        Price price2 = Price.builder()
            .bar(bar1) // Tom Sawyer's
            .drink(drink1) // Karhu III
            .price(new BigDecimal(8.00).setScale(2, RoundingMode.UNNECESSARY))
            .createdBy(user1) // Admin
            .updatedBy(user1) // Admin
            .build();
        Price price3 = Price.builder()
            .bar(bar1)
            .drink(drink3)
            .price(new BigDecimal(5.50).setScale(2, RoundingMode.UNNECESSARY))
            .happyHour(hh1)
            .createdBy(user1)
            .updatedBy(user1)
            .build();
        Price price4 = Price.builder()
            .bar(bar1)
            .drink(drink3)
            .price(new BigDecimal(7.50).setScale(2, RoundingMode.UNNECESSARY))
            .createdBy(user1)
            .updatedBy(user1)
            .build();
        Price price5 = Price.builder()
            .bar(bar1)
            .drink(drink1)
            .price(new BigDecimal(3.50).setScale(2, RoundingMode.UNNECESSARY))
            .happyHour(hh1)
            .createdBy(user1)
            .updatedBy(user1)
            .build();
        Price price6 = Price.builder()
            .bar(bar3)
            .drink(drink1)
            .price(new BigDecimal(7).setScale(2, RoundingMode.UNNECESSARY))
            .happyHour(null)
            .createdBy(user1)
            .updatedBy(user1)
            .build();
        Price price7 = Price.builder()
            .bar(bar4)
            .drink(drink1)
            .price(new BigDecimal(12).setScale(2, RoundingMode.UNNECESSARY))
            .happyHour(null)
            .createdBy(user1)
            .updatedBy(user1)
            .build();
        Price price8 = Price.builder()
            .bar(bar5)
            .drink(drink1)
            .price(new BigDecimal(13).setScale(2, RoundingMode.UNNECESSARY))
            .happyHour(null)
            .createdBy(user1)
            .updatedBy(user1)
            .build();
        Price price9 = Price.builder()
            .bar(bar6)
            .drink(drink1)
            .price(new BigDecimal(11).setScale(2, RoundingMode.UNNECESSARY))
            .happyHour(null)
            .createdBy(user1)
            .updatedBy(user1)
            .build();

        priceRepository.save(price1);
        priceRepository.save(price2);
        priceRepository.save(price3);
        priceRepository.save(price4);
        priceRepository.save(price5);
        priceRepository.save(price6);
        priceRepository.save(price7);
        priceRepository.save(price8);
        priceRepository.save(price9);

        barRepository.findAll().forEach(bar -> System.out.println(bar));
    }
}
