package com.happypour.happypour.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import com.happypour.happypour.entity.enums.WeekDay;

import java.sql.Timestamp;
import java.time.LocalTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "happy_hour", schema = "public") // specify schema if necessary
public class HappyHour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "happy_hour_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "bar_id", nullable = false)
    private Bar bar;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @ElementCollection(targetClass = WeekDay.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "weekdays", joinColumns = @JoinColumn(name = "happy_hour_id"))
    @OnDelete(action = OnDeleteAction.CASCADE) // ensure DB FK uses ON DELETE CASCADE
    @Column(name = "weekday")
    private Set<WeekDay> weekDays;

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
