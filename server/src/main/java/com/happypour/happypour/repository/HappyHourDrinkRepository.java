package com.happypour.happypour.repository;

import com.happypour.happypour.model.HappyHour;
import com.happypour.happypour.model.HappyHourDrink;
import com.happypour.happypour.model.embeddable.HappyHourDrinkId;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface HappyHourDrinkRepository extends JpaRepository<HappyHourDrink, HappyHourDrinkId>{

    @Query("SELECT hhd FROM HappyHourDrink hhd WHERE hhd.id.happyHourId.id = ?1")
    public List<HappyHourDrink> findByHappyHourId(Long happyHourId);
}
