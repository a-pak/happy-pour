package com.happypour.happypour.dto;

import com.happypour.happypour.model.Drink;
import com.happypour.happypour.model.User;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
@Getter
@Setter
public class DrinkDTO {
    private Long id;
    private String name;
    private Long barId;
    private double normalPrice;
    private User updatedBy;
    private Timestamp updatedAt;

    public DrinkDTO(Drink drink) {
        this.id = drink.getId();
        this.name = drink.getName();
        this.barId = drink.getBar().getId();
        this.normalPrice = drink.getNormalPrice();
        this.updatedBy = drink.getUpdatedBy();
        this.updatedAt = drink.getUpdatedAt();
    }
}
