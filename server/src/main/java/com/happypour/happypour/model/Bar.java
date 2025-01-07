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
    private Coordinates coordinates;
    private String address;
    private double beer05Price;
    private double wine075Price;
    private double coffeePrice;
    private double entryFee;
    private double cloakRoomFee;

    public Bar(String name, Coordinates coordinates, String address) {
        this.name = name;
        this.coordinates = coordinates;
        this.address = address;
    }
}

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
class Coordinates {
    private double lat;
    private double lng;
}