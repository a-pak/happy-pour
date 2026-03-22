package com.happypour.happypour.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.happypour.happypour.entity.Price;

import java.util.List;
import java.util.Optional;

@Repository
public interface PriceRepository extends JpaRepository<Price, Long> {
    @Query("SELECT p FROM Price p WHERE p.bar.id=?1")
    List<Price> findByBar(Long barId);

    @Query("SELECT p FROM Price p WHERE p.happyHour.id=?1")
    List<Price> findByHappyHourId(Long happyHourId);
    
    /**
     * Fetch existing price with given bar id, drink id and happy hour id.
     * @param barId
     * @param drinkId
     * @param happyHourId
     * @return Optional Price
     */
    @Query("""
    SELECT p FROM Price p
    WHERE p.bar.id = :barId
      AND p.drink.id = :drinkId
      AND ((:happyHourId IS NULL AND p.happyHour IS NULL)
           OR (p.happyHour.id = :happyHourId))
    """)
    Optional<Price> findExistingPrice(Long barId, Long drinkId, Long happyHourId);

}
