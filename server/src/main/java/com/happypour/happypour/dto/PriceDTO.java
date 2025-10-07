package com.happypour.happypour.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.happypour.happypour.model.Price;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class PriceDTO {
    private Long id;
    private BigDecimal price;
    private Long barId;
    private Long happyHourId;
    private Long drinkId;
    private String drinkName;
    private String drinkType;
    private BigDecimal drinkSize;
    private String createdBy;
    private String createdAt;
    private String updatedBy;
    private String updatedAt;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long creatorId;

    public PriceDTO(Price price) {
        this.id = price.getId();
        this.price = price.getPrice();
        this.barId = price.getBar().getId();
        this.happyHourId = price.getHappyHour() != null ? price.getHappyHour().getId() : null;
        this.drinkId = price.getDrink().getId();
        this.drinkName = price.getDrink().getName();
        this.drinkType = price.getDrink().getType().toString();
        this.drinkSize = price.getDrink().getSize();
        this.createdBy = price.getCreatedBy().getUsername();
        this.createdAt = price.getCreatedAt().toString();
        this.creatorId = price.getCreatedBy().getId();
        this.updatedAt = price.getUpdatedAt().toString();
        this.updatedBy = price.getUpdatedBy().getUsername();
    }
}