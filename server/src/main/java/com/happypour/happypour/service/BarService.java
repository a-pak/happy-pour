package com.happypour.happypour.service;

import com.happypour.happypour.dto.*;
import com.happypour.happypour.model.*;
import com.happypour.happypour.repository.BarRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BarService {

    @Autowired
    private BarRepository barRepository;

    @Autowired
    UserService userService;
    @Autowired
    private HappyHourService happyHourService;
    @Autowired
    private DrinkService drinkService;


    public List<BarsGetResponse> getAllBars() {
        List<Bar> bars = barRepository.findAll();
        List<HappyHour> happyHours = happyHourService.getAll();
        List<Drink> drinks = drinkService.getAllDrinks();
        List<HappyHourDrink> hhDrinks = drinkService.getAllHappyHourDrinks();

        List<BarsGetResponse> barsGetResponses = new ArrayList<>();

        for (Bar bar : bars) {
            BarsGetResponse dto = new BarsGetResponse();
            dto.setBar(bar);
            // Check if HappyHour
            Optional<HappyHour> happyHour = happyHours.stream()
                    .filter(hh -> hh.getBar().getId().equals(bar.getId()))
                    .findFirst();
            happyHour.ifPresent(dto::setHappyHour);

            // Get Drinks with HappyHour
            Optional<HappyHourDrink> hhDrink = happyHour.flatMap(hh -> hhDrinks.stream()
                    .filter(hhd -> hhd.getHappyHour().getId().equals(hh.getId()))
                    .findFirst());
            hhDrink.ifPresent(hhd -> {
                dto.getHappyHourDrinks().add(new HappyHourDrinkDTO(hhd));
            });

            // Get Drinks without HappyHour
            for (Drink drink : drinks) {
                if(drink.getBar().getId() == bar.getId()) {
                    dto.getDrinks().add(new DrinksByBarResponse(drink));
                }
            }
            barsGetResponses.add(dto);
        }

        return barsGetResponses;
    }

    public BarsGetResponse getById(Long id) {
        BarsGetResponse barsGetResponse;
        Optional<Bar> optionalBar = barRepository.findById(id);
        
        if (optionalBar.isPresent()) {
            barsGetResponse = new BarsGetResponse();
            barsGetResponse.setBar(optionalBar.get());

            List<DrinksByBarResponse> drinks = new ArrayList<>(drinkService.findByBar(id));
            barsGetResponse.setDrinks(drinks);
            
            List<HappyHour> lh = happyHourService.findByBar(id);
            if(!lh.isEmpty()) {
                HappyHour hh = lh.get(0);
                barsGetResponse.setHappyHour(hh);
                List<HappyHourDrink> hhds = drinkService.findByHappyHourId(hh.getId());
                for (HappyHourDrink hhd : hhds) {
                    barsGetResponse.getHappyHourDrinks().add(new HappyHourDrinkDTO(hhd));
                }
            }

            return barsGetResponse;
            
        } else {
            return null;
        }

    }
    public Bar createBar(Bar bar) {
        bar.setId(null);
        return barRepository.save(bar);
    }

    public Bar updateBar(Long barId, Bar updatedBar) {
        return barRepository.findById(barId)
                .map(existingBar -> {
                    BeanUtils.copyProperties(updatedBar, existingBar, "id");
                    return barRepository.save(existingBar);
                })
                .orElse(null);
    }

    public ResponseEntity<String> removeBar(Long id) {
        Optional<Bar> barToDelete = barRepository.findById(id);
        if(barToDelete.isPresent()) {
            try {
                barRepository.deleteById(id); // App crashes here
                return ResponseEntity.ok("Bar with ID " + id + " deleted.");

            } catch (Exception e) {
                System.err.println("Error occurred  while deleting bar: " + e.getMessage());
                return ResponseEntity.internalServerError().build();
            }
            }
        return ResponseEntity.notFound().build();
    }
}