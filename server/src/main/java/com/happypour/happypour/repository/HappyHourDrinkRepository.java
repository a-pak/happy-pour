package com.happypour.happypour.repository;

import com.happypour.happypour.model.HappyHourDrink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HappyHourDrinkRepository extends JpaRepository<HappyHourDrink, Long>{

}
