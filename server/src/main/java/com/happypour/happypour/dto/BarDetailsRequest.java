package com.happypour.happypour.dto;
import java.util.ArrayList;
import java.util.List;

import com.happypour.happypour.model.Bar;
import com.happypour.happypour.model.Drink;
import com.happypour.happypour.model.HappyHour;
import com.happypour.happypour.model.HappyHourDrink;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

@Getter
@Setter
@AllArgsConstructor
public class BarDetailsRequest {
    private Bar bar;
    private HappyHour happyHour;
    private List<HappyHourDrink> happyHourDrinks;
    private List<Drink> drinks;

    public BarDetailsRequest() {
        this.happyHourDrinks = new ArrayList<>();
        this.drinks = new ArrayList<>();
    }

}