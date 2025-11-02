package com.happypour.happypour.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.sql.Timestamp;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;

import com.happypour.happypour.dto.BarDataDTO;
import com.happypour.happypour.model.Bar;
import com.happypour.happypour.model.Drink;
import com.happypour.happypour.model.HappyHour;
import com.happypour.happypour.model.Price;
import com.happypour.happypour.model.User;
import com.happypour.happypour.model.enums.DrinkType;

@SpringBootTest
@ActiveProfiles("test")
class BarDataServiceTest {

    @InjectMocks
    private BarDataService barDataService;

    @Mock
    private BarService barService;
    @Mock
    private HappyHourService happyHourService;
    @Mock
    private PriceService priceService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllBars_withHappyHoursAndNormalPrices_returnsMappedData() {
        // Prepare bar
        Bar bar = Bar.builder()
        .id(1L)
        .name("Test bar")
        .address("Pop")
        .cloakroomFee(0)
        .entryFee(0)
        .coordLat(0)
        .coordLong(0)
        .createdAt(new Timestamp(0))
        .updatedAt(new Timestamp(0))
        .createdBy(new User())
        .updatedBy(new User())
        .openFrom(java.time.LocalTime.now())
        .openTo(java.time.LocalTime.now())
        .build();
        List<Bar> bars = List.of(bar);

        // Prepare happy hour linked to bar
        HappyHour hh = mock(HappyHour.class);
        when(hh.getId()).thenReturn(10L);
        when(hh.getBar()).thenReturn(bar);
        when(hh.getStartTime()).thenReturn(java.time.LocalTime.now());
        when(hh.getEndTime()).thenReturn(java.time.LocalTime.now());
        when(hh.getCreatedAt()).thenReturn(new Timestamp(0));
        when(hh.getUpdatedAt()).thenReturn(new Timestamp(0));
        when(hh.getCreatedBy()).thenReturn(new User());
        when(hh.getUpdatedBy()).thenReturn(new User());
        List<HappyHour> happyHours = List.of(hh);

        // Prepare prices: one for happy hour, one normal price for the bar
        Drink drink = Drink.builder().id(5L).name("Drink").type(DrinkType.BEER).build();
        Price priceForHh = mock(Price.class);
        when(priceForHh.getId()).thenReturn(100L);
        when(priceForHh.getHappyHour()).thenReturn(hh);
        when(priceForHh.getBar()).thenReturn(bar);
        when(priceForHh.getDrink()).thenReturn(drink);
        when(priceForHh.getCreatedBy()).thenReturn(new User());
        when(priceForHh.getUpdatedBy()).thenReturn(new User());
        when(priceForHh.getCreatedAt()).thenReturn(new Timestamp(0));
        when(priceForHh.getUpdatedAt()).thenReturn(new Timestamp(0));
        
        Price normalPrice = mock(Price.class);
        when(normalPrice.getId()).thenReturn(200L);
        when(normalPrice.getHappyHour()).thenReturn(null);
        when(normalPrice.getBar()).thenReturn(bar);
        when(normalPrice.getDrink()).thenReturn(drink);
        when(normalPrice.getCreatedBy()).thenReturn(new User());
        when(normalPrice.getUpdatedBy()).thenReturn(new User());
        when(normalPrice.getCreatedAt()).thenReturn(new Timestamp(0));
        when(normalPrice.getUpdatedAt()).thenReturn(new Timestamp(0));

        List<Price> prices = List.of(priceForHh, normalPrice);

        // Mock services
        when(barService.getAll()).thenReturn(bars);
        when(happyHourService.getAll()).thenReturn(happyHours);
        when(priceService.getAllPrices()).thenReturn(prices);

        // Execute
        List<BarDataDTO> result = barDataService.getAllBars();

        // Verify
        assertNotNull(result);
        assertEquals(1, result.size());

        BarDataDTO dto = result.get(0);
        assertNotNull(dto.getBar());
        assertEquals(1, dto.getHappyHours().size(), "Happy hours should contain the associated happy hour");
        assertEquals(1, dto.getPrices().size(), "Normal prices should contain the bar's normal price");

        // Happy hour should contain the happy-hour-specific price
        assertEquals(1, dto.getHappyHours().get(0).getPrices().size());

        // Happy-hour prices should not contain the normal price
        dto.getHappyHours().get(0).getPrices().forEach(hhp -> {
            assertFalse(hhp.getId().equals(normalPrice.getId()));
        });
        
        // Normal prices should not contain the happy-hour price
        dto.getPrices().forEach(p -> {
            assertFalse(p.getId().equals(priceForHh.getId()));
        }); 
    }

    @Test
    void getDataDtoById_withExistingBar_returnsMappedData() {
        // Prepare bar
        Bar bar = Bar.builder()
        .id(2L)
        .name("Test bar")
        .address("Pop")
        .cloakroomFee(0)
        .entryFee(0)
        .coordLat(0)
        .coordLong(0)
        .createdAt(new Timestamp(0))
        .updatedAt(new Timestamp(0))
        .createdBy(new User())
        .updatedBy(new User())
        .openFrom(java.time.LocalTime.now())
        .openTo(java.time.LocalTime.now())
        .build();

        // Prepare happy hour
        HappyHour hh = mock(HappyHour.class);
        when(hh.getId()).thenReturn(20L);
        when(hh.getBar()).thenReturn(bar);
        when(hh.getStartTime()).thenReturn(java.time.LocalTime.now());
        when(hh.getEndTime()).thenReturn(java.time.LocalTime.now());
        when(hh.getCreatedAt()).thenReturn(new Timestamp(0));
        when(hh.getUpdatedAt()).thenReturn(new Timestamp(0));
        when(hh.getCreatedBy()).thenReturn(new User());
        when(hh.getUpdatedBy()).thenReturn(new User());

        // Prices: one tied to happy hour, one normal
        Drink drink = Drink.builder().id(5L).name("Drink").type(DrinkType.BEER).build();
        Price priceForHh = mock(Price.class);
        when(priceForHh.getHappyHour()).thenReturn(hh);
        when(priceForHh.getBar()).thenReturn(bar);
        when(priceForHh.getDrink()).thenReturn(drink);
        when(priceForHh.getCreatedBy()).thenReturn(new User());
        when(priceForHh.getUpdatedBy()).thenReturn(new User());
        when(priceForHh.getCreatedAt()).thenReturn(new Timestamp(0));
        when(priceForHh.getUpdatedAt()).thenReturn(new Timestamp(0));
        Price normalPrice = mock(Price.class);
        when(normalPrice.getHappyHour()).thenReturn(null);
        when(normalPrice.getBar()).thenReturn(bar);
        when(normalPrice.getDrink()).thenReturn(drink);
        when(normalPrice.getCreatedBy()).thenReturn(new User());
        when(normalPrice.getUpdatedBy()).thenReturn(new User());
        when(normalPrice.getCreatedAt()).thenReturn(new Timestamp(0));
        when(normalPrice.getUpdatedAt()).thenReturn(new Timestamp(0));

        List<Price> prices = List.of(priceForHh, normalPrice);
        List<HappyHour> happyHours = List.of(hh);

        // Mock services
        when(barService.getById(2L)).thenReturn(bar);
        when(happyHourService.findByBarId(2L)).thenReturn(happyHours);
        when(priceService.getByBarId(2L)).thenReturn(prices);

        // Execute
        BarDataDTO dto = barDataService.getDataDtoById(2L);

        // Verify
        assertNotNull(dto);
        assertNotNull(dto.getBar());
        assertEquals(1, dto.getHappyHours().size(), "Should contain one happy hour");
        assertEquals(1, dto.getHappyHours().get(0).getPrices().size(), "Happy hour should include its price");
        assertEquals(1, dto.getPrices().size(), "Should include one normal price");
    }

    @Test
    void getDataDtoById_withMissingBar_throwsNotFound() {
        when(barService.getById(99L)).thenReturn(null);

        assertThrows(ResponseStatusException.class, () -> barDataService.getDataDtoById(99L));
    }
}