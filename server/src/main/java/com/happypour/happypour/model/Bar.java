package com.happypour.happypour.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class Bar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Embedded
    private double coordLong;
    private double coordLat;
    private String address;
    private double beer05Price;
    private double wine075Price;
    private double coffeePrice;
    private double entryFee;
    private double cloakRoomFee;

    public Bar(String name, double coordLat, double coordLong, String address) {
        this.name = name;
        this.coordLong = coordLong;
        this.coordLat = coordLat;
        this.address = address;
    }
}
