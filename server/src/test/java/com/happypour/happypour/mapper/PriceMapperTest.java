package com.happypour.happypour.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.happypour.happypour.dto.PriceDTO;
import com.happypour.happypour.entity.Bar;
import com.happypour.happypour.entity.Drink;
import com.happypour.happypour.entity.HappyHour;
import com.happypour.happypour.entity.Price;
import com.happypour.happypour.entity.User;
import com.happypour.happypour.entity.enums.DrinkType;

@SpringBootTest
@ActiveProfiles("test")
public class PriceMapperTest {
    
    protected User testUser;
    protected User updatedUser;
    protected Bar testBar;
    protected Drink testDrink;
    protected HappyHour testHappyHour;
    protected PriceDTO testPriceDTO;
    protected Price testPrice;
    protected Timestamp testTimestamp;
    
    @BeforeEach
    void setup() {
        testTimestamp = Timestamp.from(Instant.now());
        
        testUser = User.builder()
            .id(1L)
            .username("creator")
            .email("creator@test.com")
            .build();
        
        updatedUser = User.builder()
            .id(2L)
            .username("updater")
            .email("updater@test.com")
            .build();
        
        testBar = Bar.builder()
            .id(1L)
            .name("Test Bar")
            .address("123 Test Street")
            .coordLat(60.1699)
            .coordLong(24.9384)
            .build();
        
        testDrink = Drink.builder()
            .id(1L)
            .name("Beer")
            .type(DrinkType.BEER)
            .size(new BigDecimal("0.50"))
            .createdBy(testUser)
            .updatedBy(testUser)
            .build();
        
        testHappyHour = HappyHour.builder()
            .id(1L)
            .bar(testBar)
            .build();
        
        testPriceDTO = PriceDTO.builder()
            .price(new BigDecimal("3.50"))
            .barId(1L)
            .drinkId(1L)
            .happyHourId(1L)
            .creatorId(1L)
            .build();
        
        testPrice = Price.builder()
            .id(1L)
            .price(new BigDecimal("3.50"))
            .bar(testBar)
            .drink(testDrink)
            .happyHour(testHappyHour)
            .createdBy(testUser)
            .updatedBy(updatedUser)
            .createdAt(testTimestamp)
            .updatedAt(testTimestamp)
            .build();
    }
    @Test
    @DisplayName("Test that toEntity maps all fields correctly")
    void test_that_toEntity_maps_all_fields_correctly() {
        Price price = PriceMapper.toEntity(testPriceDTO, testBar, testDrink, testHappyHour, testUser, updatedUser);
        
        assertEquals(price.getPrice(), testPriceDTO.getPrice(), "Price was not mapped correctly");
        assertTrue(price.getBar().getId().equals(testPriceDTO.getBarId()),"Bar ID was not mapped correctly");
        assertTrue(price.getDrink().getId().equals(testPriceDTO.getDrinkId()),"Drink id was not mapped correcty");
        assertTrue(price.getHappyHour().getId().equals(testPriceDTO.getHappyHourId()), "Happy Hour Id was not mapped correctly");
        assertTrue( price.getCreatedBy().getId().equals(testPriceDTO.getCreatorId()), "User CreatedBy was not mapped correctly");
        assertTrue(price.getUpdatedBy().getId().equals(updatedUser.getId()), "User UpdatedBy was not mapped correctly");
    }

    @Test
    @DisplayName("Test that toDTO maps all fields correctly")
    void test_that_toDTO_maps_all_fields_correctly() {
        PriceDTO priceDTO = PriceMapper.toDTO(testPrice);
        
        assertEquals(priceDTO.getPrice(), testPrice.getPrice(), "Price was not mapped correctly");
        assertTrue(priceDTO.getBarId().equals(testPrice.getBar().getId()),"Bar ID was not mapped correctly");
        assertTrue(priceDTO.getDrinkId().equals(testPrice.getDrink().getId()),"Drink id was not mapped correcty");
        assertTrue(priceDTO.getHappyHourId().equals(testPrice.getHappyHour().getId()), "Happy Hour Id was not mapped correctly");
        assertTrue( priceDTO.getCreatedBy().equals(testPrice.getCreatedBy().getUsername()), "User CreatedBy was not mapped correctly");
        assertTrue(priceDTO.getUpdatedBy().equals(testPrice.getUpdatedBy().getUsername()), "User UpdatedBy was not mapped correctly");
    }

}
