package com.happypour.happypour.service;

import org.junit.jupiter.api.Test;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.*;

import com.happypour.happypour.dto.PriceDTO;
import com.happypour.happypour.model.*;
import com.happypour.happypour.model.enums.DrinkType;
import com.happypour.happypour.repository.PriceRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.mockito.*;
import org.springframework.web.server.ResponseStatusException;

@SpringBootTest
@ActiveProfiles("test")
class PriceServiceTest {

    @Spy
    @InjectMocks
    private PriceService priceService;

    @Mock
    private PriceRepository priceRepository;
    @Mock
    private UserService userService;
    @Mock
    private BarService barService;
    @Mock
    private DrinkService drinkService;
    @Mock
    private HappyHourService happyHourService;

    private PriceDTO dto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        dto = new PriceDTO();
        dto.setBarId(1L);
        dto.setBarId(1L);
        dto.setPrice(new BigDecimal("5.00"));
    }

    @Test
    void testGetAllPrices() {
        Price price = Price.builder().id(1L).build();
        when(priceRepository.findAll()).thenReturn(List.of(price));

        List<Price> result = priceService.getAllPrices();

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
    }

    @Test
    void testGetAllPriceDTOs_returnsDTOs() {
        Bar bar = Bar.builder().id(1L).build();
        Drink drink = Drink.builder().id(1L).type(DrinkType.BEER).build();
        User user = User.builder().id(1l).build();
        Price price = Price.builder()
            .id(1L)
            .bar(bar)
            .drink(drink)
            .createdBy(user).updatedBy(user)
            .createdAt(new Timestamp(0))
            .updatedAt(new Timestamp(0))
            .build();
        
        when(priceRepository.findAll()).thenReturn(List.of(price));

        List<PriceDTO> dtos = priceService.getAllPriceDTOs();

        assertEquals(1, dtos.size());
        assertEquals(1L, dtos.get(0).getId());
    }

    @Test
    void testGetAllPriceDTOs_emptyList_returnsNull() {
        when(priceRepository.findAll()).thenReturn(Collections.emptyList());

        assertNull(priceService.getAllPriceDTOs());
    }

    @Test
    void testGetDTOsByBarId_found() {
        // --- Setup mock entities ---
        Bar bar = Bar.builder().id(1L).build();
        Drink drink = Drink.builder().id(1L).type(DrinkType.BEER).build();
        User user = User.builder().id(1L).build();
        Price price = Price.builder()
            .id(1L)
            .bar(bar)
            .createdBy(user)
            .updatedBy(user)
            .createdAt(new Timestamp(0))
            .updatedAt(new Timestamp(0))
            .drink(drink)
            .build();
        
        // --- Mock repository calls ---
        when(priceRepository.findByBar(1L)).thenReturn(List.of(price));
        // --- Execute ---
        List<PriceDTO> dtos = priceService.getDTOsByBarId(1L);
        // --- Assert ---
        assertEquals(1, dtos.size());
    }

    @Test
    void testGetDTOsByBarId_notFound() {
        // --- Setup mock methods
        when(priceRepository.findByBar(1L)).thenReturn(Collections.emptyList());

        // --- Execute and Assert 404 exception ---
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
            () -> priceService.getDTOsByBarId(1L));
        assertEquals("404 NOT_FOUND \"No prices found for bar id 1\"", exception.getMessage());
    }

    @Test
    void testCreatePrice_success() {
        // --- Setup mock entities ---
        User user = User.builder().id(1L).build();
        Bar bar = Bar.builder().id(1L).build();
        Drink drink = Drink.builder().id(1L).build();
        
        // --- Setup DTOs ---
        PriceDTO dto = new PriceDTO();
        dto.setCreatorId(1L);
        dto.setDrinkId(1L);
        dto.setBarId(1L);
        dto.setPrice(new BigDecimal("5.00"));
        
        // --- Mock service and repository calls ---
        when(userService.getById(1L)).thenReturn(user);
        when(barService.getById(1L)).thenReturn(bar);
        when(priceRepository.findExistingPrice(1L, 1L, null)).thenReturn(Optional.empty());
        when(drinkService.getById(1L)).thenReturn(drink);
        
        // --- Execute ---
        priceService.createPrice(List.of(dto));
        // --- Verify that priceRepository.save() was called ---
        verify(priceRepository, times(1)).save(any(Price.class));
    }

    @Test
    void testCreatePrice_userNotFound_throwsException() {
        // --- Setup dtos ---
        PriceDTO dto = new PriceDTO();
        dto.setBarId(1L);
        dto.setCreatorId(1L);
        dto.setPrice(new BigDecimal("5.00"));
        // --- Mock methods ---
        when(userService.getById(1L)).thenReturn(null);
        // --- Execute and Assert exception ---
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
            () -> priceService.createPrice(List.of(dto)));
        assertEquals("404 NOT_FOUND \"User not found\"", exception.getMessage());
    }

    @Test
    void testDoesntCreateDuplicatePrice() {
        // --- Setup mock entities ---
        User user = User.builder().id(1L).build();
        Bar bar = Bar.builder().id(1L).build();
        Drink drink = Drink.builder().id(1L).build();
        Price existingPrice = Price.builder().id(1L).build();
        Optional<Price> optionalPrice = Optional.of(existingPrice);

        // --- Setup DTOs ---
        PriceDTO dto = new PriceDTO();
        dto.setId(1L); // important for update
        dto.setBarId(1L);
        dto.setDrinkId(1L);
        dto.setCreatorId(1L);
        dto.setPrice(new BigDecimal("5.00"));

        // Add duplicate DTO to simulate duplicate creation
        List<PriceDTO> dtoList = new ArrayList<>();
        dtoList.add(dto);
        dtoList.add(dto);

        // --- Mock service calls ---
        when(userService.getById(1L)).thenReturn(user);
        when(barService.getById(1L)).thenReturn(bar);
        when(drinkService.getById(1L)).thenReturn(drink);

        // findExistingPrice returns existingPrice for duplicates
        when(priceRepository.findExistingPrice(1L, 1L, null))
                .thenReturn(Optional.of(existingPrice));
        // findById returns the existing price
        when(priceRepository.findById(1L)).thenReturn(optionalPrice);
        // --- Execute ---
        priceService.createPrice(dtoList);

        // --- Verify ---  
        // 1. updatePrice should have been called twice for duplicate DTOs
        //    meaning save() is called twice on the existing price
        verify(priceRepository, times(2)).save(existingPrice);

        // 2. No new Price objects should have been created
        verify(priceRepository, never()).save(argThat(p -> p != existingPrice));
    }

    @Test
    @DisplayName("Test that updatePrice is called for duplicate PriceDTOs")
    void testUpdatePriceCalledForDuplicate() {
        // --- Setup entities ---
        User user = User.builder().id(1L).build();
        Bar bar = Bar.builder().id(1L).build();
        Drink drink = Drink.builder().id(1L).build();
        Price existingPrice = Price.builder().id(1L).build();

        // --- Setup DTOs ---
        PriceDTO dto = new PriceDTO();
        dto.setId(1L);  // important: matches existing Price
        dto.setBarId(1L);
        dto.setDrinkId(1L);
        dto.setCreatorId(1L);
        dto.setPrice(new BigDecimal("5.00"));

        List<PriceDTO> dtoList = new ArrayList<>();
        dtoList.add(dto);
        dtoList.add(dto); // duplicate

        // --- Mock dependencies ---
        when(userService.getById(1L)).thenReturn(user);
        when(barService.getById(1L)).thenReturn(bar);
        when(drinkService.getById(1L)).thenReturn(drink);

        // Return existing price for duplicates
        when(priceRepository.findExistingPrice(1L, 1L, null))
                .thenReturn(Optional.of(existingPrice));
        when(priceRepository.findById(1L)).thenReturn(Optional.of(existingPrice));

        // --- Execute ---
        priceService.createPrice(dtoList);

        // --- Verify updatePrice() called for each duplicate ---
        verify(priceService, times(2)).updatePrice(dto);

        // --- Verify save() called on existing price ---
        verify(priceRepository, times(2)).save(existingPrice);

        // --- Ensure no new Price objects were created ---
        verify(priceRepository, never()).save(argThat(p -> p != existingPrice));
    }
}

