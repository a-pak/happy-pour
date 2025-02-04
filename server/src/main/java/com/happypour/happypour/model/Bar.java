package com.happypour.happypour.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

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

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy; // Assuming a User entity exists

    @ManyToOne
    @JoinColumn(name = "updated_by", nullable = false)
    private User updatedBy; // Assuming a User entity exists

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

//    @Column(name="beer05price", precision = 5)
//    private double beer05Price;
//
//    @Column(name="wine075price", precision = 5)
//    private double wine075Price;
//
//    @Column(name="coffeeprice", precision = 5)
//    private double coffeePrice;
//
//    @Column(name="entryfee", precision = 5)
//    private double entryFee;
//
//    @Column(name="cloakroomfee", precision = 5)
//    private double cloakroomFee;

//    @Column(name="beer05price", precision = 5)
//    private double beer05Price;
//
//    @Column(name="wine075price", precision = 5)
//    private double wine075Price;
//
//    @Column(name="coffeeprice", precision = 5)
//    private double coffeePrice;
//
//    @Column(name="entryfee", precision = 5)
//    private double entryFee;
//
//    @Column(name="cloakroomfee", precision = 5)
//    private double cloakroomFee;

}

