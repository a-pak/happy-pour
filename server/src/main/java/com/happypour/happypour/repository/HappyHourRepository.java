package com.happypour.happypour.repository;

import com.happypour.happypour.model.HappyHour;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface HappyHourRepository extends JpaRepository<HappyHour, Long> {

    @Query("SELECT hh FROM HappyHour hh WHERE hh.bar.id = ?1")
    List<HappyHour> findByBarId(Long id);
    
}
