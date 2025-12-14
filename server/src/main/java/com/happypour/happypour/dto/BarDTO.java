package com.happypour.happypour.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Data Transfer Object for Bar entity.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class BarDTO {
    private Long id;
    private String name;
    private String address;
    private Double coordLong;
    private Double coordLat;
    private String openFrom;
    private String openTo;
    //private BigDecimal entryFee;
    //private BigDecimal cloakRoomFee;
    private String createdBy;
    private String createdAt;
    private String updatedBy;
    private String updatedAt;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long creatorId;
}