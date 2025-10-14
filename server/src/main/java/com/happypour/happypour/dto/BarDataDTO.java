package com.happypour.happypour.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
/**
 * Data Transfer Object that aggregates: 
 * <li> - BarDTO</li>
 * <li> - List of normal prices (PriceDTOs)</li> 
 * <li> - List of HappyHourDTOs (which in turn include their own PriceDTOs)</li>
 */
@Getter
@Setter
public class BarDataDTO {
    private BarDTO bar;
    private List<PriceDTO> prices;
    private List<HappyHourDTO> happyHours;

    public BarDataDTO() {
        this.prices = new ArrayList<>();
        this.happyHours = new ArrayList<>();
    }
}