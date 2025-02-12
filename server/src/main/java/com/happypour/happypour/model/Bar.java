package com.happypour.happypour.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "bar", schema = "public")
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

    @Column(name="open_from")
    private LocalTime openFrom;

    @Column(name="open_to")
    private LocalTime openTo;

    @Column(name="entryfee", precision = 5)
    private double entryFee;

    @Column(name="cloakroomfee", precision = 5)
    private double cloakroomFee;

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

