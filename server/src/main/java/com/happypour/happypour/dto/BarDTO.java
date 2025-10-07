package com.happypour.happypour.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.happypour.happypour.model.Bar;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Data Transfer Object for Bar entity.
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
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

    public BarDTO(Bar bar) {
        this.id = bar.getId();
        this.name = bar.getName();
        this.address = bar.getAddress();
        this.coordLong = bar.getCoordLong();
        this.coordLat = bar.getCoordLat();
        this.openFrom = bar.getOpenFrom().toString();
        this.openTo = bar.getOpenTo().toString();
        this.createdBy = bar.getCreatedBy().getUsername();
        this.createdAt = bar.getCreatedAt().toString();
        this.creatorId = bar.getCreatedBy().getId();
        this.updatedAt = bar.getUpdatedAt().toString();
        this.updatedBy = bar.getUpdatedBy().getUsername();
    }
}