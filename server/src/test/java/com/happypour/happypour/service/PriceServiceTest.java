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
import com.happypour.happypour.entity.*;
import com.happypour.happypour.entity.enums.DrinkType;
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
    PriceService priceService;

    @Mock
    PriceRepository priceRepository;
    @Mock
    UserService userService;
    @Mock
    BarService barService;
    @Mock
    DrinkService drinkService;
    @Mock
    HappyHourService happyHourService;

    PriceDTO dto;
    Price price;
    Bar bar;
    Drink drink;
    User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        bar = Bar.builder().id(1L).build();
        drink = Drink.builder().id(1L).type(DrinkType.BEER).build();
        user = User.builder().id(1l).build();
        dto = PriceDTO.builder()
            .id(1L)
            .creatorId(1L)
            .drinkId(1L)
            .barId(1L)
            .price(new BigDecimal("5.00"))
            .build();
        price = Price.builder()
            .id(1L)
            .bar(bar)
            .drink(drink)
            .createdBy(user).updatedBy(user)
            .createdAt(new Timestamp(0))
            .updatedAt(new Timestamp(0))
            .build();
    }

    @Test
    void testGetAllPrices() {
        Price price = Price.builder().id(1L).build();
        when(priceRepository.findAll()).thenReturn(List.of(price));

        List<Price> result = priceService.getAllPrices();

        assertEquals(1, result.size(), "List of prices was not the expected length.");
        assertEquals(1L, result.get(0).getId());
    }

    @Test
    void testGetAllPriceDTOs_returnsDTOs() {
        // --- Given ---     
        when(priceRepository.findAll()).thenReturn(List.of(price));
        // ---When ---
        List<PriceDTO> dtos = priceService.getAllPriceDTOs();
        // --- Then ---
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
        // --- Given ---
        when(priceRepository.findByBar(1L)).thenReturn(List.of(price));
        // --- When ---
        List<PriceDTO> dtos = priceService.getDTOsByBarId(1L);
        // --- Then ---
        assertEquals(1, dtos.size());
    }

    @Test
    void testGetDTOsByBarId_throwsNotFound() {
        // --- Given
        when(priceRepository.findByBar(1L)).thenReturn(Collections.emptyList());
        // --- When ---
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
            () -> priceService.getDTOsByBarId(1L));
        // --- Then ---
        assertEquals("404 NOT_FOUND \"No prices found for bar id 1\"", exception.getMessage());
    }

    @Test
    void testCreatePrice_success() { 
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
        // --- Mock methods ---
        when(userService.getById(1L)).thenReturn(null);
        // --- Execute and Assert exception ---
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
            () -> priceService.createPrice(List.of(dto)));
        assertEquals("404 NOT_FOUND \"User not found\"", exception.getMessage());
    }

    @Test
    void testDoesntCreateDuplicatePrice() {
        Price existingPrice = Price.builder().id(1L).build();
        Optional<Price> optionalPrice = Optional.of(existingPrice);

        // --- Given ---
        
        // Add duplicate DTO to simulate duplicate creation
        List<PriceDTO> dtoList = new ArrayList<>();
        dtoList.add(dto);
        dtoList.add(dto);

        when(userService.getById(1L)).thenReturn(user);
        when(barService.getById(1L)).thenReturn(bar);
        when(drinkService.getById(1L)).thenReturn(drink);

        // findExistingPrice returns existingPrice for duplicates
        when(priceRepository.findExistingPrice(1L, 1L, null))
                .thenReturn(Optional.of(existingPrice));
        // findById returns the existing price
        when(priceRepository.findById(1L)).thenReturn(optionalPrice);
        // --- When ---
        priceService.createPrice(dtoList);

        // --- Then ---  
        // To save the duplicate prices, repository.save() should have been calles 2 times.
        verify(priceRepository, times(2)).save(existingPrice);
        // Verify that no new Price objects have been created
        verify(priceRepository, never()).save(argThat(p -> p != existingPrice));
    }

    @Test
    @DisplayName("Test that updatePrice is called for duplicate PriceDTOs")
    void testUpdatePriceCalledForDuplicate() {
        // --- Setup entities ---
        Price existingPrice = Price.builder().id(1L).build();
        
        // Add duplicate DTO to simulate duplicate creation
        List<PriceDTO> dtoList = new ArrayList<>();
        dtoList.add(dto);
        dtoList.add(dto);

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
        verify(priceService, times(2)).updatePrice(1L, dto);

        // --- Verify save() called on existing price ---
        verify(priceRepository, times(2)).save(existingPrice);

        // --- Ensure no new Price objects were created ---
        verify(priceRepository, never()).save(argThat(p -> p != existingPrice));
    }
}

