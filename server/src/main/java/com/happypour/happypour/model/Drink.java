package com.happypour.happypour.model;


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
@Table(name = "drink", schema = "public") // specify schema if necessary
public class Drink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "bar_id", nullable = false)
    private Bar bar;  // Assuming Bar entity exists

    @Column(name = "normal_price", nullable = false, precision = 5)
    private double normalPrice;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;  // Assuming User entity exists

    @ManyToOne
    @JoinColumn(name = "updated_by", nullable = false)
    private User updatedBy;  // Assuming User entity exists

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;
}
