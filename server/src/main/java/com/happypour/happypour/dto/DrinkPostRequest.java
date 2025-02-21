package com.happypour.happypour.dto;

import com.happypour.happypour.model.Drink;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrinkPostRequest {
    private Drink[] drinks;
}
