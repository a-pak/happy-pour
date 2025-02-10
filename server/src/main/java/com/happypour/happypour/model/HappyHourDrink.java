package com.happypour.happypour.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.happypour.happypour.model.embeddable.HappyHourDrinkId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "happy_hour_drink", schema = "public")
public class HappyHourDrink {
    @JsonIgnore
    @EmbeddedId
    private HappyHourDrinkId id;

    @ManyToOne
    @MapsId("happyHourId")
    @JoinColumn(name = "happy_hour_id", nullable = false)
    private HappyHour happyHour;

    @ManyToOne
    @MapsId("drinkId")
    @JoinColumn(name = "drink_id", nullable = false)
    private Drink drink;

    @Column(name = "happy_hour_price", nullable = false)
    private double happyHourPrice;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by", nullable = false)
    private User updatedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

}
