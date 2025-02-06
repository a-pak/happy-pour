package com.happypour.happypour.dto;

import com.happypour.happypour.model.Bar;
import com.happypour.happypour.model.HappyHour;
import com.happypour.happypour.model.Drink;
import com.happypour.happypour.model.HappyHourDrink;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BarListRequest {
    private Bar bar;
    private Drink drink;
    private HappyHour happyHour;
    private HappyHourDrink hhDrink;
}