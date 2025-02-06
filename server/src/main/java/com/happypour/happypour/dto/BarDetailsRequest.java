package com.happypour.happypour.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BarDetailsRequest {
    private String name;
    private String address;
    private double coordLat;
    private double coordLong;
    private double beer05Price;
    private double wine075Price;
    private double coffeePrice;
    private double entryFee;
    private double cloakroomFee;
}
