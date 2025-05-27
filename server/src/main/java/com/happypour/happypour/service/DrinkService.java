package com.happypour.happypour.service;

import com.happypour.happypour.dto.DrinksByBarResponse;
import com.happypour.happypour.dto.DrinkPostRequest;
import com.happypour.happypour.model.*;

import com.happypour.happypour.repository.DrinkRepository;
import com.happypour.happypour.repository.HappyHourDrinkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import org.springframework.beans.BeanUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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

    public void createDrink(DrinkPostRequest drinkPostRequest) {
        List<Drink> drinks = Arrays.stream(drinkPostRequest.getDrinks()).toList();
        drinks.forEach(drink -> {
            drink.setId(null);
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

    public Drink updateDrink(Drink updatedDrink) {
            return drinkRepository.findById(updatedDrink.getId())
                    .map(existing -> {
                        existing.setNormalPrice(updatedDrink.getNormalPrice());
                        existing.setUpdatedBy(updatedDrink.getUpdatedBy());
                        existing.setUpdatedAt(updatedDrink.getUpdatedAt());
                        return drinkRepository.save(existing);
                    })
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Drink not found"));
    }

    public List<DrinksByBarResponse> findByBar(Long id) {
        List<DrinksByBarResponse> dtos = new ArrayList<>();
        List<Drink> drinks = drinkRepository.findByBar(id);

        for (Drink d: drinks) {
            dtos.add(new DrinksByBarResponse(d));
        }
        return dtos;
    }

    public List<HappyHourDrink> findByHappyHourId(Long id) {
        return happyHourDrinkRepository.findByHappyHourId(id);
    }

    public void deleteDrink(Drink d) {
        drinkRepository.deleteById(d.getId());
    }
}
