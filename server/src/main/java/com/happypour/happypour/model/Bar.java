package com.happypour.happypour.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "bar", schema = "public") // specify schema if necessary
public class Bar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="name")
    private String name;

    @Column(name="coordlong", precision = 9)
    private double coordLong;

    @Column(name="coordlat", precision = 8)
    private double coordLat;

    @Column(name="address")
    private String address;

    @Column(name="beer05price", precision = 5)
    private double beer05Price;

    @Column(name="wine075price", precision = 5)
    private double wine075Price;

    @Column(name="coffeeprice", precision = 5)
    private double coffeePrice;

    @Column(name="entryfee", precision = 5)
    private double entryFee;

    @Column(name="cloakroomfee", precision = 5)
    private double cloakRoomFee;

}

