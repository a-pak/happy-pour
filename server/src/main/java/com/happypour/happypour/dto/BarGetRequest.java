package com.happypour.happypour.dto;
import java.util.ArrayList;
import java.util.List;

import com.happypour.happypour.model.Bar;
import com.happypour.happypour.model.Drink;
import com.happypour.happypour.model.HappyHour;
import com.happypour.happypour.model.HappyHourDrink;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BarGetRequest {
    private Bar bar;
    private HappyHour happyHour;
    private List<HappyHourDrinkDTO> happyHourDrinks;
    private List<DrinkDTO> drinks;

    public BarGetRequest() {
        this.happyHourDrinks = new ArrayList<>();
        this.drinks = new ArrayList<>();
    }
}