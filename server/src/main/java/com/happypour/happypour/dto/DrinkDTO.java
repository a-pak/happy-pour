package com.happypour.happypour.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.happypour.happypour.model.Drink;
import com.happypour.happypour.model.enums.DrinkType;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object for Drink entity.
 */
@Getter
@Setter
@NoArgsConstructor
public class DrinkDTO {
    private Long id;
    private String name;
    private DrinkType type; // String?
    private BigDecimal size;
    private String createdBy;
    private String createdAt;
    private String updatedBy;
    private String updatedAt;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long creatorId;

    public DrinkDTO(Drink drink) {
        this.id = drink.getId();
        this.name = drink.getName();
        this.type = drink.getType();
        this.size = drink.getSize();
        this.createdBy = drink.getCreatedBy().getUsername();
        this.createdAt = drink.getCreatedAt().toString();
        this.creatorId = drink.getCreatedBy().getId();
        this.updatedAt = drink.getUpdatedAt().toString();
        this.updatedBy = drink.getUpdatedBy().getUsername();
    }
}
