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
public class BarService {

    @Autowired
    private BarRepository barRepository;
    @Autowired
    private DrinkRepository drinkRepository;
    @Autowired
    private HappyHourRepository happyHourRepository;
    @Autowired
    private HappyHourDrinkRepository happyHourDrinkRepository;

    @Autowired
    DrinkService ds;
    HappyHourDrinkService hhds;

    public List<BarListRequest> getAllBars() {
        List<Bar> bars = barRepository.findAll();
        List<HappyHour> happyHours = happyHourRepository.findAll();
        List<Drink> drinks = drinkRepository.findAll();
        List<HappyHourDrink> hhDrinks = happyHourDrinkRepository.findAll();

        List<BarListRequest> barListRequests = new ArrayList<>();

        for (Bar bar : bars) {
            BarListRequest dto = new BarListRequest();
            dto.setBar(bar);
            // Check if HappyHour
            Optional<HappyHour> happyHour = happyHours.stream()
                    .filter(hh -> hh.getBar().getId().equals(bar.getId()))
                    .findFirst();
            happyHour.ifPresent(dto::setHappyHour);

            // Get Drinks if HappyHour
            Optional<HappyHourDrink> hhDrink = happyHour.flatMap(hh -> hhDrinks.stream()
                    .filter(hhd -> hhd.getHappyHour().getId().equals(hh.getId()))
                    .findFirst());
            hhDrink.ifPresent(dto::setHhDrink);

            // Get Drinks without HappyHour
            Optional<Drink> drink = drinks.stream()
                    .filter(d -> d.getBar().getId().equals(bar.getId()))
                    .findFirst();
            drink.ifPresent(dto::setDrink);

            barListRequests.add(dto);
        }

        return barListRequests;
    }

    public BarDetailsRequest getById(Long id) {
        BarDetailsRequest barDetailsRequest;
        Optional<Bar> optionalBar = barRepository.findById(id);
        
        if (optionalBar.isPresent()) {
            barDetailsRequest = new BarDetailsRequest();
            barDetailsRequest.setBar(optionalBar.get());

            List<Drink> drinks = new ArrayList<>(drinkRepository.findByBar(id));
            barDetailsRequest.setDrinks(drinks);
            
            List<HappyHour> lh = happyHourRepository.findByBar(id);
            if(!lh.isEmpty()) {
                HappyHour hh = lh.get(0);
                barDetailsRequest.setHappyHour(hh);
                barDetailsRequest.setHappyHourDrinks(happyHourDrinkRepository.findByHappyHourId(hh.getId()));
            }

            return barDetailsRequest;
            
        } else {
            return null;
        }

    }

//    public Bar getBar(Long id) {
//        Optional<Bar> bar = barRepository.findById(id);
//        System.out.println("Fetching bar: " + bar);
//        return bar.orElse(null);
//    }

    public void setBar(Bar bar, List<Drink> drinks, HappyHour happyHour, List<HappyHourDrink> happyHourDrinks) {
        System.out.println("BarService: Adding bar: " + bar.toString());
        bar.setId(null);
        Bar savedBar = barRepository.save(bar);

        if (happyHour != null) {
            happyHour.setBar(savedBar);
            happyHourRepository.save(happyHour);
        }

        if (drinks != null && !drinks.isEmpty()) {
            ds.setBar(drinks, savedBar);
        }

        if (happyHourDrinks != null && !happyHourDrinks.isEmpty()) {
            hhds.setDrink(happyHourDrinks, bar);
        }
    }

    public Bar updateBar(Long id, Bar updatedBar) {
        return barRepository.findById(id)
                .map(existingBar -> {
                    BeanUtils.copyProperties(updatedBar, existingBar, "id");
                    return barRepository.save(existingBar);
                })
                .orElse(null);
    }


    public ResponseEntity<String> removeBar(Long id) {
        if (!barRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        barRepository.deleteById(id);
        return ResponseEntity.ok("Bar with ID " + id + " deleted.");
    }
}