package com.happypour.happypour.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.happypour.happypour.model.Price;
import java.util.List;

@Repository
public interface PriceRepository extends JpaRepository<Price, Long> {
    @Query("SELECT p FROM Price p WHERE p.bar.id=?1")
    List<Price> findByBar(Long barId);

    @Query("SELECT p FROM Price p WHERE p.happyHour.id=?1")
    List<Price> findByHappyHourId(Long happyHourId);
}
