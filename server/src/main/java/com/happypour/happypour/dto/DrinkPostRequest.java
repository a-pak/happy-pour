package com.happypour.happypour.dto;

import com.happypour.happypour.model.Drink;
import lombok.Getter;

@Getter
public class DrinkPostRequest {
    private Drink[] drinks;
}
