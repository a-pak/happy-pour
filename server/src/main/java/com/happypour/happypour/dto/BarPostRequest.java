package com.happypour.happypour.dto;

import com.happypour.happypour.model.Bar;
import com.happypour.happypour.model.Drink;
import com.happypour.happypour.model.HappyHour;
import com.happypour.happypour.model.HappyHourDrink;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BarPostRequest {
    private Bar bar;
    private HappyHour happyHour;
    private List<Drink> drinks;
    private List<HappyHourDrink> happyHourDrinks;
    private Long userId;
}
