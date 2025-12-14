package com.happypour.happypour.service;

import com.happypour.happypour.dto.DrinkDTO;
import com.happypour.happypour.mapper.DrinkMapper;
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

    protected List<Drink> getAllDrinks() {
        return drinkRepository.findAll();
    }

    public List<DrinkDTO> getAllDTOs() {
        List<Drink> drinks = drinkRepository.findAll();
        if(drinks.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "no drinks found");

        List<DrinkDTO> drinkDTOs = drinks.stream().map(drink -> DrinkMapper.toDTO(drink)).toList();
        return drinkDTOs;
    }
    
    public DrinkDTO getDtoById(Long id) {
        Optional<Drink> drink = drinkRepository.findById(id);
        if(drink.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Drink with id "+ id +" not found");
        
        return DrinkMapper.toDTO(drink.get());
    }

    protected Drink getById(Long id) {
        Optional<Drink> drink = drinkRepository.findById(id);
        if(drink.isPresent()) {
            return drink.get();
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Drink not found");
    }
    
    public void createDrink(List<DrinkDTO> drinkDtos) {
        Long updaterId = drinkDtos.get(0).getCreatorId(); 
        if(updaterId == null) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Creator id not provided");

        User user = userService.getById(updaterId);
        if(user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        
        drinkDtos.forEach(dto -> {
            Drink drink = DrinkMapper.toEntity(dto, user);
            drinkRepository.save(drink);
        });
    }

    public DrinkDTO updateDrink(Long drinkId, DrinkDTO drinkDto) {
        if(drinkDto.getCreatorId() == null) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Creator id not provided");
        Optional<Drink> existingDrink = drinkRepository.findById(drinkId);
        if (existingDrink.isPresent()) {
            BeanUtils.copyProperties(drinkDto, existingDrink.get(), "id", "createdBy", "createdAt");
            Drink updatedDrink = drinkRepository.save(existingDrink.get());
            return DrinkMapper.toDTO(updatedDrink);
        
        } else throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Drink with id "+ drinkId +" not found");
    }
    
    public void deleteDrink(Long drinkId) {
        getById(drinkId);
        drinkRepository.deleteById(drinkId);
    }
}
