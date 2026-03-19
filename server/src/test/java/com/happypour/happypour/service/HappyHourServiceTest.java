package com.happypour.happypour.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentCaptor.forClass;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;

import com.happypour.happypour.dto.HappyHourDTO;
import com.happypour.happypour.mapper.HappyHourMapper;
import com.happypour.happypour.model.Bar;
import com.happypour.happypour.model.HappyHour;
import com.happypour.happypour.model.User;
import com.happypour.happypour.model.enums.WeekDay;
import com.happypour.happypour.repository.HappyHourRepository;

@SpringBootTest
@ActiveProfiles("test")
public class HappyHourServiceTest {
    @Autowired
    HappyHourRepository repository;

    HappyHour hh1, hh2;
    HappyHourDTO expected;
    Bar bar1, bar2;
    User user;

    @InjectMocks
    HappyHourService happyHourService;

    @Mock
    HappyHourRepository repositoryMock;

    @Mock
    BarService barServiceMock;

    @Mock
    UserService userServiceMock;

    // @Mock
    // HappyHour hhMock;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        user = User.builder()
            .id(1L)
            .username("user1")
            .build();

        bar1 = Bar.builder()
            .id(1L)
            .name("Test1")
            .build();
        bar2 = Bar.builder()
            .id(2L)
            .name("Test2")
            .build();

        hh1 = HappyHour.builder()
            .id(1L)
            .bar(bar1)
            .createdBy(user)
            .updatedBy(user)
            .weekDays(EnumSet.of(WeekDay.MONDAY))
            .startTime(LocalTime.of(12, 0))
            .endTime(LocalTime.of(23, 59))
            .createdAt(new Timestamp(1230))
            .updatedAt(new Timestamp(2330))
            .build();
        hh2 = HappyHour.builder()
            .id(2L)
            .bar(bar1)
            .createdBy(user)
            .updatedBy(user)
            .createdAt(new Timestamp(1200))
            .updatedAt(new Timestamp(1200))
            .build();
        expected = new HappyHourDTO(
            1L, 
            EnumSet.of(WeekDay.MONDAY), 
            LocalTime.of(12, 00), 
            LocalTime.of(23, 59), 
            1L,
             "user1", 
             LocalTime.now().toEpochSecond(LocalDate.now(), ZoneOffset.ofHours(2)),
             "user1", 
             LocalTime.now().toEpochSecond(LocalDate.now(), ZoneOffset.ofHours(2)), 
             null, 
             1L
            );
        expected = HappyHourMapper.toDTO(hh1, null);
    }

    @Test
    void testGetAll() {
        // --- Given ---
        when(repositoryMock.findAll()).thenReturn(List.of(hh1));
        // --- When ---
        List<HappyHour> result = happyHourService.getAll();
        // --- Then ---
        assertEquals(hh1, result.get(0), "getAll() didn't return expected result");
        assertEquals(1, result.size(), "List of happy hours was not the expected size of 1");
    }

    @Test
    void testGetById_normal() {
         // --- Given ---
        when(repositoryMock.findById(1L)).thenReturn(Optional.of(hh1));

        // --- When ---
        HappyHour result = happyHourService.getById(1L);

        // --- Then ---
        assertEquals(hh1, result, "Result didn't return excpected value. Expected " + hh1 +", got " + result);
    }

    @Test
    void testGetById_null() {
        // --- Given ---
        when(repositoryMock.findById(1L)).thenReturn(Optional.of(hh1));

        // --- When ---
        HappyHour result = happyHourService.getById(3L);
        
        // --- Then ---
        assertEquals(null, result, "Result was not null. Got: "+ result);
    }

    @Test
    void testGetHappyHourDTOById() {
        // --- Given ---
        when(repositoryMock.findById(1L)).thenReturn(Optional.of(hh1));
        // --- When ---
        HappyHourDTO result = happyHourService.getHappyHourDTOById(1L);
        // --- Then ---
        assertEquals(1L, result.getBarId(), "Result was expected. Got: "+ result);
    }

    @Test
    void testGetHappyHourDTOById_throwsNotFound() {
        // --- Given ---
        when(repositoryMock.findByBarId(1L)).thenReturn(List.of(hh1, hh2));
        // --- When ---
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->  happyHourService.getHappyHourDTOById(999L));
        // --- Then ---
        assertEquals("404 NOT_FOUND \"Happy hour with id 999 not found\"", exception.getMessage(), "Error message was not as expected.");
    }

    @Test
    void testGetDTOsByBarId_normal() {
        // --- Given ---
        when(repositoryMock.findByBarId(1L)).thenReturn(List.of(hh1, hh2));
        // --- When ---
        List<HappyHourDTO> result = happyHourService.getDTOsByBarId(1L);
        // --- Then ---
        assertEquals(
            1L, 
            result.get(0).getBarId(), 
            "Bar id did not match expected value: "+result.get(0).getBarId()
        );
        assertEquals(1L,
            result.get(1).getBarId(), 
            "Bar id did not match expected value: "+result.get(1).getBarId()
        );
    }

    @Test
    void testCreateHappyHour_Success() {
        // --- Given ---
        when(barServiceMock.getById(1L)).thenReturn(bar1);
        when(userServiceMock.getById(1L)).thenReturn(user);
        when(repositoryMock.save(any(HappyHour.class))).thenAnswer(invocation -> {
            // Capture repository.save parameter value
            HappyHour saved = invocation.getArgument(0);

            // Inject timestamps to avoid null exception later in mapper
            saved.setCreatedAt(new Timestamp(0));
            saved.setUpdatedAt(new Timestamp(0));
            return saved;
        });

        // --- When ---
        HappyHourDTO result = happyHourService.createHappyHour(expected);

        // --- Then ---
        assertNotNull(result);
        assertEquals(1L, result.getBarId());
        assertEquals(1L, result.getCreatorId());

        // Capture the HappyHour passed to save()
        ArgumentCaptor<HappyHour> happyHourCaptor = forClass(HappyHour.class);
        verify(repositoryMock).save(happyHourCaptor.capture());
        HappyHour savedHappyHour = happyHourCaptor.getValue();

        // Assert on the saved entity's fields
        assertEquals(bar1, savedHappyHour.getBar());
        assertEquals(expected.getStartTime(), savedHappyHour.getStartTime());
        assertEquals(expected.getEndTime(), savedHappyHour.getEndTime());
        assertEquals(expected.getWeekDays(), savedHappyHour.getWeekDays());
        assertEquals(user, savedHappyHour.getCreatedBy());
        assertEquals(user, savedHappyHour.getUpdatedBy());
    }
    @Test
    void testCreateHappyHour_throwsNotFound() {
        // --- Given ---
        when(barServiceMock.getById(1L)).thenReturn(bar1);
        when(userServiceMock.getById(1L)).thenReturn(null);

        // --- When ---
        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class, 
            () -> happyHourService.createHappyHour(expected)
        );
        // --- Then ---
        assertEquals("404 NOT_FOUND \"User with id 1 not found\"", exception.getMessage());
    }
    @Test
    void testCreateHappyHour_throwsBadRequest() {
        // --- Given ---
        HappyHourDTO dtoMock = Mockito.mock(HappyHourDTO.class);
        when(dtoMock.getBarId()).thenReturn(1L);
        when(barServiceMock.getById(1L)).thenReturn(bar1);
        when(dtoMock.getCreatorId()).thenReturn(null);

        // --- When ---
        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class, 
        () -> happyHourService.createHappyHour(dtoMock)
        );

        // --- Then ---
        assertEquals("400 BAD_REQUEST \"Creator id not provided\"", exception.getMessage());
    }
    @Test
    void testUpdateHappyHour_Success() {
        // -- Setup entities --
        HappyHour expected = hh1;
        // WeekDays changed from hhMock1
        expected.setWeekDays(EnumSet.of(WeekDay.TUESDAY, WeekDay.WEDNESDAY));
        // Setup corresponding dto 
        HappyHourDTO dtoFromExpected = HappyHourMapper.toDTO(expected, null);

        // --- Given ---
        when(repositoryMock.findById(1L)).thenReturn(Optional.of(hh1));
        when(userServiceMock.getById(1L)).thenReturn(user);
        when(repositoryMock.save(any(HappyHour.class))).thenAnswer(invocation -> {
            // Capture repository.save parameter value
            HappyHour saved = invocation.getArgument(0);

            // Inject timestamps to avoid null exception later in mapper
            saved.setCreatedAt(new Timestamp(0));
            saved.setUpdatedAt(new Timestamp(0));
            return saved;
        });
        // --- When ---
        HappyHourDTO result = happyHourService.updateHappyHour(1L, dtoFromExpected);
        // --- Then ---
        assertNotNull(result);
        assertEquals(
            EnumSet.of(WeekDay.TUESDAY, WeekDay.WEDNESDAY), 
            result.getWeekDays(), 
            "Week days were not as expected"
        );
        verify(repositoryMock).save(expected); // Verify the repository was called

        // Capture the HappyHour passed to save()
        ArgumentCaptor<HappyHour> happyHourCaptor = forClass(HappyHour.class);
        verify(repositoryMock).save(happyHourCaptor.capture());
        HappyHour savedHappyHour = happyHourCaptor.getValue();

        assertEquals(expected.getStartTime(), savedHappyHour.getStartTime());
        assertEquals(expected.getEndTime(), savedHappyHour.getEndTime());
        assertEquals(expected.getWeekDays(), savedHappyHour.getWeekDays());
    }

}