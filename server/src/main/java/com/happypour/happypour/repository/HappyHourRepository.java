package com.happypour.happypour.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.happypour.happypour.entity.HappyHour;

@Repository
public interface HappyHourRepository extends JpaRepository<HappyHour, Long> {

    @Query("SELECT hh FROM HappyHour hh WHERE hh.bar.id = ?1")
    List<HappyHour> findByBarId(Long id);
    
}
