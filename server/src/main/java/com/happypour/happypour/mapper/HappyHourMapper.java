package com.happypour.happypour.mapper;

import java.util.ArrayList;
import java.util.List;

import com.happypour.happypour.dto.HappyHourDTO;
import com.happypour.happypour.dto.PriceDTO;
import com.happypour.happypour.model.Bar;
import com.happypour.happypour.model.HappyHour;
import com.happypour.happypour.model.Price;
import com.happypour.happypour.model.User;
/**
 * Mapper for Happy Hours. Includes functions for mapping database entity to http-layer DTO and DTO to database entity.
 */
public class HappyHourMapper {
    // Helper method to convert a list of Price entities to a list of PriceDTO records
    private static List<PriceDTO> mapPrices(List<Price> prices) {
        if (prices == null)
            return new ArrayList<PriceDTO>();

        return prices.stream()
                     .map(PriceMapper::toDTO)
                     .toList();
    }
    /**
     * Maps happy hour entity to a happy hour  DTO.
     * @param happyHour entity
     * @param associatedPrices List of associated Price entities
     * @return Happy hour dto from given happy hour entity.
     */
    public static HappyHourDTO toDTO(HappyHour happyHour, List<Price> associatedPrices) {
        String createdByUsername = happyHour.getCreatedBy() != null ? happyHour.getCreatedBy().getUsername() : null;
        String updatedByUsername = happyHour.getUpdatedBy() != null ? happyHour.getUpdatedBy().getUsername() : null;
        Long creatorId = happyHour.getUpdatedBy() != null ? happyHour.getUpdatedBy().getId() : null;
        Long barId = happyHour.getBar() != null ? happyHour.getBar().getId() : null;

        return new HappyHourDTO(
            happyHour.getId(),
            happyHour.getWeekDays(), 
            happyHour.getStartTime(),
            happyHour.getEndTime(),
            barId,
            createdByUsername,
            happyHour.getCreatedAt().toString(),
            updatedByUsername,
            happyHour.getUpdatedAt().toString(),
            mapPrices(associatedPrices),
            creatorId
        );
    }
    /**
     * Maps happy hour DTO to database entity HappyHour.
     * @param happyHourDTO hh dto
     * @param createdBy User that created latest reindition
     * @param bar Associated bar entity
     * @return Happy hour Entity from given dto.
     */
    public static HappyHour toEntity(HappyHourDTO happyHourDTO, Bar bar, User createdBy) {
        return HappyHour.builder()
            .bar(bar)
            .startTime(happyHourDTO.getStartTime())
            .endTime(happyHourDTO.getEndTime())
            .weekDays(happyHourDTO.getWeekDays())
            .createdBy(createdBy)
            .updatedBy(createdBy)
            .build();
    }
}
