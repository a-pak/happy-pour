package com.happypour.happypour.dto;
import java.util.List;

import com.happypour.happypour.model.Bar;
import com.happypour.happypour.model.Drink;
import com.happypour.happypour.model.HappyHour;
import com.happypour.happypour.model.HappyHourDrink;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BarDetailsRequest {
    private Bar bar;
    private HappyHour happyHour;
    private List<HappyHourDrink> happyHourDrinks;
    private List<Drink> drinks;

}