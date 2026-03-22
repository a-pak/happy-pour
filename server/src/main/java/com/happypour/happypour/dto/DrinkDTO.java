package com.happypour.happypour.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.happypour.happypour.entity.enums.DrinkType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Drink entity.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrinkDTO {
    private Long id;
    private String name;
    private DrinkType type; // String?
    private BigDecimal size;
    private String createdBy;
    private Long createdAt;
    private String updatedBy;
    private Long updatedAt;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long creatorId;
}
