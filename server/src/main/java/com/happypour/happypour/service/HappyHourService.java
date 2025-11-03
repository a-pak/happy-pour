package com.happypour.happypour.service;

import com.happypour.happypour.dto.HappyHourDTO;
import com.happypour.happypour.model.*;

import com.happypour.happypour.repository.HappyHourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
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
    protected HappyHour getById(Long id) {
        return happyHourRepository.findById(id).orElse(null);
    }
    protected List<HappyHour> findByBarId(Long barId) {
        return happyHourRepository.findByBarId(barId);
    }
    public HappyHourDTO getHappyHourDTOById(Long id) {
        Optional<HappyHour> happyHour = happyHourRepository.findById(id);
        if(happyHour.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Happy hour with id "+ id +" not found");
        
        return new HappyHourDTO(happyHour.get());
    }
    public List<HappyHourDTO> getDTOsByBarId(Long barId) {
        List<HappyHour> happyHours = happyHourRepository.findByBarId(barId);
        if(happyHours.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Happy hours for bar id "+ barId +" not found");

        List<HappyHourDTO> happyHourDTOs = new ArrayList<>();
        happyHours.forEach(happyHour -> happyHourDTOs.add(new HappyHourDTO(happyHour)));
        return happyHourDTOs;
    }

    public HappyHour createHappyHour(HappyHourDTO happyHourDTO) {
        Bar bar = barService.getById(happyHourDTO.getBarId());
        if(bar == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bar not found");

        User user = userService.getById(happyHourDTO.getCreatorId());
        if(user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found");

        HappyHour happyHour = HappyHour.builder()
                .id(null)
                .bar(bar)
                .startTime(happyHourDTO.getStartTime())
                .endTime(happyHourDTO.getEndTime())
                .weekDays(happyHourDTO.getWeekDays())
                .createdBy(user)
                .updatedBy(user)
                .build();
        return happyHourRepository.save(happyHour);
    }

    public void updateHappyHour(Long id, HappyHourDTO updatedHappyHour) {
        Optional<HappyHour> existingHappyHour = happyHourRepository.findById(id);
        if(existingHappyHour.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Happy hour with id "+ id +" not found");
        
        HappyHour existing = existingHappyHour.get();
        
        // Map simple fields from DTO -> entity (only allowed/meaningful fields)
        if (updatedHappyHour.getStartTime() != null) {
            existing.setStartTime(updatedHappyHour.getStartTime());
        }
        if (updatedHappyHour.getEndTime() != null) {
            existing.setEndTime(updatedHappyHour.getEndTime());
        }
        if (updatedHappyHour.getWeekDays() != null) {
            existing.setWeekDays(updatedHappyHour.getWeekDays());
        }
        
        // If caller provided a user id for the updater, set updatedBy
        if (updatedHappyHour.getCreatorId() != null) {
            User updater = userService.getById(updatedHappyHour.getCreatorId());
            if (updater == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
            existing.setUpdatedBy(updater);
        }
        
        // TODO: map prices list if your domain requires updating Price entities here.
        // e.g. priceService.updatePricesForHappyHour(existing, updatedHappyHour.getPrices());
        
        System.out.println("Updating Happy hour: "+ existing.toString());
        happyHourRepository.save(existing);
    }

    public void deleteHappyHour(Long id) {
        if(!happyHourRepository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Happy hour with id "+ id +" not found");
        happyHourRepository.deleteById(id);
    }
}
