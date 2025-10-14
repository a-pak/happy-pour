package com.happypour.happypour.service;

import com.happypour.happypour.dto.DrinkDTO;
import com.happypour.happypour.model.*;

import com.happypour.happypour.repository.DrinkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import org.springframework.beans.BeanUtils;
import org.springframework.web.server.ResponseStatusException;

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
    private UserService userService;

    public List<Drink> getAllDrinks() {
        return drinkRepository.findAll();
    }

    public List<DrinkDTO> getAllDTOs() {
        List<Drink> drinks = drinkRepository.findAll();
        if(drinks.isEmpty()) return null;

        List<DrinkDTO> drinkDTOs = drinks.stream().map(drink -> new DrinkDTO(drink)).toList();
        return drinkDTOs;
    }
    
    public DrinkDTO getDtoById(Long id) {
        Optional<Drink> drink = drinkRepository.findById(id);
        if(drink.isPresent()) {
            return new DrinkDTO(drink.get());
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Drink not found");
    }

    public Drink getById(Long id) {
        Optional<Drink> drink = drinkRepository.findById(id);
        if(drink.isPresent()) {
            return drink.get();
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Drink not found");
    }
    
    public void createDrink(List<DrinkDTO> drinkDtos) {
        User user = userService.getById(drinkDtos.get(0).getCreatorId());
        if(user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        
        drinkDtos.forEach(dto -> {
            Drink drink = Drink.builder()
                .id(null)
                .name(dto.getName())
                .type(dto.getType())
                .size(dto.getSize())
                .createdBy(user)
                .updatedBy(user)
                .build();

            drinkRepository.save(drink);
        });
    }

    public DrinkDTO updateDrink(Long drinkId, DrinkDTO drinkDto) {
        Optional<Drink> existingDrink = drinkRepository.findById(drinkId);
        if (existingDrink.isPresent()) {
            BeanUtils.copyProperties(drinkDto, existingDrink.get(), "id", "createdBy", "createdAt");
            Drink updatedDrink = drinkRepository.save(existingDrink.get());
            return new DrinkDTO(updatedDrink);
        }
        return null;
    }
    public void deleteDrink(Long drinkId) {
        drinkRepository.deleteById(drinkId);
    }
}
