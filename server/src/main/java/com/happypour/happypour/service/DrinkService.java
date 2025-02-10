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

/**
 * <h3>DrinkService</h3>
 * <br>
 * DrinkService serves both <b>Drinks</b> and <b>HappyHourDrinks</b>.
 * <br>
 */
@Service
public class DrinkService {

    @Autowired
    private DrinkRepository drinkRepository;
    @Autowired
    private HappyHourDrinkRepository happyHourDrinkRepository;

    /**
     * Gets all Drinks. Use <b>getAllHappyHourDrinks</b> to get all Happy Hour Drink entities.
     * @return All Drink entities.
     */
    public List<Drink> getAllDrinks() {
        return drinkRepository.findAll();
    }

    /**
     * Gets all Happy Hour Drinks.
     * @return All HappyHourDrink entities.
     */
    public List<HappyHourDrink> getAllHappyHourDrinks() {
        return happyHourDrinkRepository.findAll();
    }

    public void setBar(List<Drink> drinks, Bar bar) {
        drinks.forEach(drink -> {
            drink.setBar(bar);
            drinkRepository.save(drink);
        });
    }

    public void setHHDrink(List<HappyHourDrink> happyHourDrinks, Bar bar) {
        happyHourDrinks.forEach(hhd -> {
            hhd.setHappyHour(hhd.getHappyHour());
            hhd.getDrink().setBar(bar);
            happyHourDrinkRepository.save(hhd);
        });
    }

    public Drink updateDrink(Long id, Drink updatedDrink) {
        return drinkRepository.findById(id)
                .map(existingDrink -> {
                    BeanUtils.copyProperties(updatedDrink, existingDrink, "id", "bar");
                    return drinkRepository.save(existingDrink);
                })
                .orElse(null);
    }

    public List<Drink> findByBar(Long id) {
        return drinkRepository.findByBar(id);
    }

    public List<HappyHourDrink> findByHappyHourId(Long id) {
        return happyHourDrinkRepository.findByHappyHourId(id);
    }
}
