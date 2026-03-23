package com.happypour.happypour.mapper;

import com.happypour.happypour.dto.DrinkDTO;
import com.happypour.happypour.entity.Drink;
import com.happypour.happypour.entity.User;

public class DrinkMapper {
    public static Drink toEntity(
        DrinkDTO dto, 
        User user
    ) {
        return Drink.builder()
            .name(dto.getName())
            .size(dto.getSize())
            .type(dto.getType())
            .createdBy(user)
            .updatedBy(user)
            .build();
    }

    public static DrinkDTO toDTO(Drink drink) {
        String createdByUsername = drink.getCreatedBy() != null ? drink.getCreatedBy().getUsername() : null;
        String updatedByUsername = drink.getUpdatedBy() != null ? drink.getUpdatedBy().getUsername() : null;
        Long creatorId = drink.getCreatedBy() != null ? drink.getCreatedBy().getId() : null;
        Long createdAt = drink.getCreatedAt() != null ? drink.getCreatedAt().getTime() : null;
        Long updatedAt = drink.getUpdatedAt() != null ? drink.getUpdatedAt().getTime() : null;

        return new DrinkDTO(
            drink.getId(),
            drink.getName(),
            drink.getType(),
            drink.getSize(),
            createdByUsername,
            createdAt,
            updatedByUsername,
            updatedAt,
            creatorId
        );
    }
}
