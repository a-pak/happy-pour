package com.happypour.happypour.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.happypour.happypour.model.HappyHour;
import com.happypour.happypour.model.enums.WeekDay;

/**
 * Data Transfer Object for HappyHour entity. 
 * Includes happy hour details and a list of happy hour <b>prices</b>. 
 */
@Getter
@Setter
@NoArgsConstructor
public class HappyHourDTO {
    private Long id;
    private Set<WeekDay> weekDays;
    private String startTime;
    private String endTime;
    private Long barId;
    private String createdBy;
    private String createdAt;
    private String updatedBy;
    private String updatedAt;
    private List<PriceDTO> prices; // List of happy hour prices associated with this happy hour  
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long creatorId;

    public HappyHourDTO(HappyHour happyHour) {
        this.id = happyHour.getId();
        this.barId = happyHour.getBar().getId();
        this.weekDays = happyHour.getWeekDays(); // Convert Set<WeekDay> to String[]
        this.startTime = happyHour.getStartTime().toString();
        this.endTime = happyHour.getEndTime().toString();
        this.createdBy = happyHour.getCreatedBy().getUsername();
        this.createdAt = happyHour.getCreatedAt().toString();
        this.creatorId = happyHour.getCreatedBy().getId();
        this.updatedAt = happyHour.getUpdatedAt().toString();
        this.updatedBy = happyHour.getUpdatedBy().getUsername();

        this.prices = new ArrayList<>();
    }
}