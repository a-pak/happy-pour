package com.happypour.happypour.dto;
import java.util.ArrayList;
import java.util.List;

import com.happypour.happypour.model.Bar;
import com.happypour.happypour.model.HappyHour;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BarsGetResponse {
    private Bar bar;
    private HappyHour happyHour;
    private List<HappyHourDrinkDTO> happyHourDrinks;
    private List<DrinksByBarResponse> drinks;

    public BarsGetResponse() {
        this.happyHourDrinks = new ArrayList<>();
        this.drinks = new ArrayList<>();
    }
}