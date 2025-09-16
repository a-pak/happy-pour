package com.happypour.happypour.service;

import com.happypour.happypour.model.*;

import com.happypour.happypour.repository.HappyHourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.beans.BeanUtils;

import java.util.List;

@Service
public class HappyHourService {

    @Autowired
    HappyHourRepository happyHourRepository;

    @Autowired
    DrinkService drinkService;

    public List<HappyHour> getAll() {
        return happyHourRepository.findAll();
    }
    public HappyHour getById(Long id) {
        return happyHourRepository.findById(id).orElse(null);
    }

    public HappyHour createHappyHour(HappyHour happyHour) {
        happyHour.setId(null);
        return happyHourRepository.save(happyHour);
    }

    public HappyHour updateHappyHour(Long id, HappyHour updatedHappyHour) {
        return happyHourRepository.findById(id)
                .map(existingHappyHour -> {
                    BeanUtils.copyProperties(updatedHappyHour, existingHappyHour, "id", "bar");
                    return happyHourRepository.save(existingHappyHour);
                })
                .orElse(null);
    }

    public List<HappyHour> findByBar(Long id) {
        return happyHourRepository.findByBar(id);
    }

    public void deleteHappyHour(Long id) {
        // Then, delete the HappyHour itself
        happyHourRepository.deleteById(id);
    }

}
