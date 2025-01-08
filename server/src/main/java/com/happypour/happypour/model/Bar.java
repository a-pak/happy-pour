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

    @Column(precision = 9)
    private double coordLong;
    @Column(precision = 8)
    private double coordLat;
    @Column
    private String address;
    @Column(precision = 5)
    private double beer05Price;
    @Column(precision = 5)
    private double wine075Price;
    @Column(precision = 5)
    private double coffeePrice;
    @Column(precision = 5)
    private double entryFee;
    @Column(precision = 5)
    private double cloakRoomFee;

    public Bar(String name, double coordLat, double coordLong, String address) {
        this.name = name;
        this.coordLong = coordLong;
        this.coordLat = coordLat;
        this.address = address;
    }
}
