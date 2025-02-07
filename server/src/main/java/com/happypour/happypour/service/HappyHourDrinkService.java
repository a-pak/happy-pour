package com.happypour.happypour.service;

import com.happypour.happypour.dto.BarDetailsRequest;
import com.happypour.happypour.dto.BarListRequest;
import com.happypour.happypour.model.*;
import com.happypour.happypour.repository.BarRepository;

import com.happypour.happypour.repository.DrinkRepository;
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
public class HappyHourDrinkService {

    @Autowired
    private HappyHourDrinkRepository happyHourDrinkRepository;

    public void setDrink(List<HappyHourDrink> happyHourDrinks, Bar bar) {
        happyHourDrinks.forEach(hhd -> {
            hhd.setHappyHour(hhd.getHappyHour());  // Jos HappyHour on määritetty
            hhd.getDrink().setBar(bar);  // Liitetään juoma baariin
            happyHourDrinkRepository.save(hhd);  // Tallennetaan HappyHourDrink
        });
    }
}
