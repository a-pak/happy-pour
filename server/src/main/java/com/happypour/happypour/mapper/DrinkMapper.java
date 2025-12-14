package com.happypour.happypour.mapper;

import com.happypour.happypour.dto.DrinkDTO;
import com.happypour.happypour.model.Drink;
import com.happypour.happypour.model.User;

public class DrinkMapper {
    public static Drink toEntity(DrinkDTO dto, User user) {
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

        return new DrinkDTO(
            drink.getId(),
            drink.getName(),
            drink.getType(),
            drink.getSize(),
            createdByUsername,
            drink.getCreatedAt().toString(),
            updatedByUsername,
            drink.getUpdatedBy().getUsername(),
            creatorId
        );
    }
}
