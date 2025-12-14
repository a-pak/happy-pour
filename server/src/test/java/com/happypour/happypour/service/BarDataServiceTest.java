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
import com.happypour.happypour.dto.HappyHourDTO;
import com.happypour.happypour.dto.PriceDTO;
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

    Bar barMock;
    HappyHour hhMock;
    Drink drinkMock;
    Price normalPriceMock, priceForHhMock;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Prepare bar
        barMock = Bar.builder()
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
        hhMock = HappyHour.builder()
            .id(1L)
            .bar(barMock)
            .startTime(java.time.LocalTime.now())
            .endTime(java.time.LocalTime.now())
            .createdAt(new Timestamp(0))
            .updatedAt(new Timestamp(0))
            .createdBy(new User())
            .updatedBy(new User())
            .build();
        drinkMock = Drink.builder().id(5L).name("Drink").type(DrinkType.BEER).build();
        priceForHhMock = Price.builder()
            .id(2L)
            .happyHour(hhMock)
            .bar(barMock)
            .drink(drinkMock)
            .createdBy(new User())
            .updatedBy(new User())
            .createdAt(new Timestamp(0))
            .updatedAt(new Timestamp(0))
            .build();
        normalPriceMock = Price.builder()
            .id(1L)
            .happyHour(null)
            .bar(barMock)
            .drink(drinkMock)
            .createdBy(new User())
            .updatedBy(new User())
            .createdAt(new Timestamp(0))
            .updatedAt(new Timestamp(0))
            .build();
    }

    @Test
    void getAllBars_withHappyHoursAndNormalPrices_returnsMappedData() {
        // Prepare return lists
        List<Bar> bars = List.of(barMock);
        List<HappyHour> happyHours = List.of(hhMock);
        List<Price> prices = List.of(priceForHhMock, normalPriceMock);

        // --- Given ---
        when(barService.getAll()).thenReturn(bars);
        when(happyHourService.getAll()).thenReturn(happyHours);
        when(priceService.getAllPrices()).thenReturn(prices);

        // --- When ---
        List<BarDataDTO> result = barDataService.getAllBars();

        // --- Then ---
        assertNotNull(result, "Result was null.");
        assertEquals(1, result.size(), "Result didn't contain any barDtos.");

        BarDataDTO dto = result.get(0);
        assertNotNull(dto.getBar(), "BarDataDto didn't include a bar.");
        assertEquals(1, dto.getHappyHours().size(), "Happy hours didn't contain the associated happy hour");
        assertEquals(1, dto.getPrices().size(), "Normal prices didn't contain the bar's normal price");

        List<PriceDTO> pricesOfDto = dto.getHappyHours().get(0).getPrices();
        assertEquals(
            1, 
            pricesOfDto.size(), 
            "Length of hh prices did not meet expected length of 1."
        );

        // Happy-hour prices should not contain the normal price
        dto.getHappyHours().get(0).getPrices().forEach(hhp -> {
            assertFalse(
                hhp.getId().equals(normalPriceMock.getId()), 
                "Happy-hour prices didn't contain the normal price."
            );
        });
        
        // Normal prices should not contain the happy-hour price
        dto.getPrices().forEach(p -> {
            assertFalse(
                p.getId().equals(priceForHhMock.getId()), 
                "Normal prices contained Happy hour price."
            );
        }); 
    }

    @Test
    void getDataDtoById_withExistingBar_returnsMappedData() {
        // --- Given ---
        List<Price> prices = List.of(priceForHhMock, normalPriceMock);
        List<HappyHour> happyHours = List.of(hhMock);

        // Mock services
        when(barService.getById(1L)).thenReturn(barMock);
        when(happyHourService.getByBarId(1L)).thenReturn(happyHours);
        when(priceService.getByBarId(1L)).thenReturn(prices);

        // --- When ---
        BarDataDTO dto = barDataService.getDataDtoById(1L);

        // --- Then ---
        List<HappyHourDTO> hhs = dto.getHappyHours();
        List<PriceDTO> hhPrices = dto.getHappyHours().get(0).getPrices();
        List<PriceDTO> normalPrices = dto.getPrices();

        assertNotNull(dto);
        assertNotNull(dto.getBar());
        assertEquals(1, hhs.size(), "Should contain one happy hour");
        assertEquals(1, hhPrices.size(), "Happy hour should include its 1 price");
        assertEquals(1, normalPrices.size(), "Should include one normal price");
    }

    @Test
    void getDataDtoById_throwsNotFound() {
        when(barService.getById(999L)).thenReturn(null);

        Exception exception = assertThrows(
            ResponseStatusException.class, 
            () -> barDataService.getDataDtoById(999L)
        );
        assertEquals(
            "404 NOT_FOUND \"Bar with id 999 not found\"", 
            exception.getMessage(), 
            "Error message was not as expected."
        );
    }
}