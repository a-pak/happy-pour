package com.happypour.happypour.model.embeddable;

import jakarta.persistence.Embeddable;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import com.happypour.happypour.model.Drink;
import com.happypour.happypour.model.HappyHour;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class HappyHourDrinkId implements Serializable {

    @ManyToOne
    private HappyHour happyHourId;
    @ManyToOne
    private Drink drinkId;
}