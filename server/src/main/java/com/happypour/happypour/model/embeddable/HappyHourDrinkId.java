package com.happypour.happypour.model.embeddable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class HappyHourDrinkId implements Serializable {
    private Integer happyHourId;
    private Integer drinkId;
}