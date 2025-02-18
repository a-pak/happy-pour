package com.happypour.happypour.dto;

import com.happypour.happypour.model.HappyHourDrink;
import com.happypour.happypour.model.User;
import lombok.Getter;

import java.sql.Timestamp;
@Getter
public class HappyHourDrinkDTO {
    private Long happyHourId;
    private Long drinkId;
    private String drinkName;
    private double happyHourPrice;
    private User updatedBy;
    private Timestamp updatedAt;

    public HappyHourDrinkDTO(HappyHourDrink happyHourDrink) {
        this.happyHourId = happyHourDrink.getHappyHour().getId();
        this.drinkId = happyHourDrink.getDrink().getId();
        this.drinkName = happyHourDrink.getDrink().getName();
        this.happyHourPrice = happyHourDrink.getHappyHourPrice();
        this.updatedBy = happyHourDrink.getUpdatedBy();
        this.updatedAt = happyHourDrink.getUpdatedAt();
    }
}
