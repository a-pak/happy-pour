package com.happypour.happypour.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.happypour.happypour.entity.enums.DrinkType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class PriceDTO {
    private Long id;
    private BigDecimal price;
    private Long barId;
    private Long happyHourId;
    private Long drinkId;
    private String drinkName;
    private DrinkType drinkType;
    private BigDecimal drinkSize;
    private String createdBy;
    private Long createdAt;
    private String updatedBy;
    private Long updatedAt;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long creatorId;
}