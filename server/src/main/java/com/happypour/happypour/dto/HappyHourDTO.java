package com.happypour.happypour.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.happypour.happypour.model.enums.WeekDay;

/**
 * Data Transfer Object for HappyHour entity. 
 * Includes happy hour details and a list of happy hour prices. 
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HappyHourDTO {
    private Long id;
    private Set<WeekDay> weekDays;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long barId;
    private String createdBy;
    private String createdAt;
    private String updatedBy;
    private String updatedAt;
    
    /** List of happy hour prices associated with this happy hour */  
    private List<PriceDTO> prices;
    
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long creatorId;
}