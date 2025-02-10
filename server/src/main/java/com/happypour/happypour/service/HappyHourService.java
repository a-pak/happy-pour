package com.happypour.happypour.service;

import com.happypour.happypour.dto.BarDetailsRequest;
import com.happypour.happypour.dto.BarListRequest;
import com.happypour.happypour.model.*;

import com.happypour.happypour.repository.HappyHourDrinkRepository;
import com.happypour.happypour.repository.HappyHourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class HappyHourService {

    @Autowired
    HappyHourRepository happyHourRepository;

    public void setHappyHour(Bar bar, HappyHour happyHour) {
        happyHour.setBar(bar);
        happyHourRepository.save(happyHour);
    }

    public HappyHour updateHappyHour(Long id, HappyHour updatedHappyHour) {
        return happyHourRepository.findById(id)
                .map(existingHappyHour -> {
                    BeanUtils.copyProperties(updatedHappyHour, existingHappyHour, "id", "bar");
                    return happyHourRepository.save(existingHappyHour);
                })
                .orElse(null);
    }
}
