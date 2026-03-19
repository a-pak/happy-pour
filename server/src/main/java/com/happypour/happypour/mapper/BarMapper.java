package com.happypour.happypour.mapper;

import java.time.LocalTime;

import com.happypour.happypour.dto.BarDTO;
import com.happypour.happypour.model.Bar;
import com.happypour.happypour.model.User;
/**
 * Mapper for Bars. Includes functions for mapping database entity to http-layer DTO and DTO to database entity.
 */
public class BarMapper {
    /**
     * Maps bar DTO to database entity Bar.
     * @param dto
     * @return Bar Entity from given dto.
     */
    public static Bar toEntity(BarDTO dto, User createdByUser) {
        LocalTime openFrom = java.time.LocalTime.parse(dto.getOpenFrom());
        LocalTime openTo = java.time.LocalTime.parse(dto.getOpenTo());

        return Bar.builder()
            .name(dto.getName())
            .address(dto.getAddress())
            .coordLat(dto.getCoordLat())
            .coordLong(dto.getCoordLong())
            .openFrom(openFrom)
            .openTo(openTo)
            .createdBy(createdByUser)
            .updatedBy(createdByUser)
            
            /* Cloakroom and entry fee disabled */
            .cloakroomFee(0)
            .entryFee(0)
            .build();
    }
    /**
     * Maps bar entity to a Bar DTO.
     * @param bar entity
     * @return Bar dto from given Bar entity.
     */
    public static BarDTO toDTO(Bar bar) {
        String createdByUsername = bar.getCreatedBy() != null ? bar.getCreatedBy().getUsername() : null;
        String updatedByUsername = bar.getUpdatedBy() != null ? bar.getUpdatedBy().getUsername() : null;
        Long createdAt = bar.getCreatedAt() != null ? bar.getCreatedAt().getTime() : null;
        Long updatedAt = bar.getUpdatedAt() != null ? bar.getUpdatedAt().getTime() : null;
        String openFrom = bar.getOpenFrom() != null ? bar.getOpenFrom().toString() : null;
        String openTo = bar.getOpenTo() != null ? bar.getOpenTo().toString() : null;
        Long creatorId = bar.getCreatedBy() != null ? bar.getCreatedBy().getId() : null;
        
        return BarDTO.builder()
            .id(bar.getId())
            .name(bar.getName())
            .address(bar.getAddress())
            .coordLong(bar.getCoordLong())
            .coordLat(bar.getCoordLat())
            .openFrom(openFrom)
            .openTo(openTo)
            .createdBy(createdByUsername)
            .createdAt(createdAt)
            .updatedBy(updatedByUsername)
            .updatedAt(updatedAt)
            .creatorId(creatorId)
            .build();
    }
}