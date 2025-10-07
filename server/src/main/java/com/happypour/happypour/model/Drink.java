package com.happypour.happypour.model;

import com.happypour.happypour.model.enums.DrinkType;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.Check;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "drink", schema = "public", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"name", "type", "size"}) // Ensure unique drink by name, type, and size
})
public class Drink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private DrinkType type;

    @Column(name = "size", nullable = false, precision = 2, scale = 2)
    @Check(constraints = "size >= 0")
    private BigDecimal size;

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
