package com.happypour.happypour.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class Bar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;
    private String name;
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

@Data
@NoArgsConstructor
@AllArgsConstructor
class Coordinates {
    private double lat;
    private double lng;
}