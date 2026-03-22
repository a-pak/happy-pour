package com.happypour.happypour.mapper;
import java.math.BigDecimal;
import java.math.RoundingMode;

import com.happypour.happypour.dto.PriceDTO;
import com.happypour.happypour.entity.Bar;
import com.happypour.happypour.entity.Drink;
import com.happypour.happypour.entity.HappyHour;
import com.happypour.happypour.entity.Price;
import com.happypour.happypour.entity.User;
import com.happypour.happypour.entity.enums.DrinkType;

public class PriceMapper {

    public static Price toEntity(PriceDTO dto, Bar bar, Drink drink, HappyHour happyHour, User createdBy, User updatedBy) {
        return Price.builder()
            .price(dto.getPrice().setScale(2, RoundingMode.UNNECESSARY))
            .bar(bar)
            .drink(drink)
            .happyHour(happyHour)
            .createdBy(createdBy)
            .updatedBy(updatedBy)
            .build();
    }

    public static PriceDTO toDTO(Price price) {
        Long happyHourId = price.getHappyHour() != null ? price.getHappyHour().getId() : null;
        Long barId = price.getBar() != null ? price.getBar().getId() : null;
        
        Long drinkId = price.getDrink() != null ? price.getDrink().getId() : null;
        String drinkName = price.getDrink() != null ? price.getDrink().getName() : null;
        DrinkType drinkType = price.getDrink() != null ? price.getDrink().getType() : null;
        BigDecimal drinkSize = price.getDrink() != null ? price.getDrink().getSize() : null;
        
        String createdByUsername = price.getCreatedBy() != null ? price.getCreatedBy().getUsername() : null;
        String updatedByUsername = price.getUpdatedBy() != null ? price.getUpdatedBy().getUsername() : null;
        Long creatorId = price.getCreatedBy() != null ? price.getCreatedBy().getId() : null;

        Long createdAt = price.getCreatedAt() != null ? price.getCreatedAt().getTime() : null;
        Long updatedAt = price.getUpdatedAt() != null ? price.getUpdatedAt().getTime() : null;

        return PriceDTO.builder()
            .id(price.getId())
            .price(price.getPrice())
            .barId(barId)
            .happyHourId(happyHourId)
            .drinkId(drinkId)
            .drinkName(drinkName)
            .drinkType(drinkType)
            .drinkSize(drinkSize)
            .createdBy(createdByUsername)
            .updatedBy(updatedByUsername)
            .createdAt(createdAt)
            .updatedAt(updatedAt)
            .creatorId(creatorId)
            .build();
    }
}
