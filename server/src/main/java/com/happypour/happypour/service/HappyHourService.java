package com.happypour.happypour.service;

import com.happypour.happypour.dto.HappyHourDTO;
import com.happypour.happypour.model.*;

import com.happypour.happypour.repository.HappyHourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.beans.BeanUtils;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class HappyHourService {

    @Autowired
    HappyHourRepository happyHourRepository;

    @Autowired
    DrinkService drinkService;

    @Autowired
    BarService barService;

    @Autowired
    UserService userService;

    public List<HappyHour> getAll() {
        return happyHourRepository.findAll();
    }
    public HappyHour getById(Long id) {
        if (id == null) return null;
        return happyHourRepository.findById(id).orElse(null);
    }
    public List<HappyHour> findByBarId(Long barId) {
        if (barId == null) return null;
        return happyHourRepository.findByBarId(barId);
    }
    public HappyHourDTO getHappyHourDTOById(Long id) {
        if (id == null) return null;
        Optional<HappyHour> happyHour = happyHourRepository.findById(id);
        if(happyHour.isPresent()) return new HappyHourDTO(happyHour.get());

        return null;
    }
    public List<HappyHourDTO> getDTOsByBarId(Long barId) {
        List<HappyHour> happyHours = happyHourRepository.findByBarId(barId);
        if(happyHours.isEmpty()) return null;

        List<HappyHourDTO> happyHourDTOs = new ArrayList<>();
        happyHours.forEach(happyHour -> happyHourDTOs.add(new HappyHourDTO(happyHour)));
        return happyHourDTOs;
    }

    public HappyHour createHappyHour(HappyHourDTO happyHourDTO) {
        Bar bar = barService.getById(happyHourDTO.getBarId());
        if(bar == null) throw new RuntimeException("Bar not found");

        User user = userService.getById(happyHourDTO.getCreatorId());
        if(user == null) throw new RuntimeException("User not found");

        HappyHour happyHour = HappyHour.builder()
                .id(null)
                .bar(bar)
                .startTime(LocalTime.parse(happyHourDTO.getStartTime()))
                .endTime(LocalTime.parse(happyHourDTO.getEndTime()))
                .weekDays(happyHourDTO.getWeekDays())
                .createdBy(user)
                .updatedBy(user)
                .build();
        return happyHourRepository.save(happyHour);
    }

    public HappyHour updateHappyHour(Long hhId, HappyHourDTO updatedHappyHour) {
        return happyHourRepository.findById(hhId)
                .map(existingHappyHour -> {
                    BeanUtils.copyProperties(updatedHappyHour, existingHappyHour, "id", "bar");
                    return happyHourRepository.save(existingHappyHour);
                })
                .orElse(null);
    }

    public void deleteHappyHour(Long id) {
        happyHourRepository.deleteById(id);
    }
}
