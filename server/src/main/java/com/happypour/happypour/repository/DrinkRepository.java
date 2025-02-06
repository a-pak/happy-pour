package com.happypour.happypour.repository;

import com.happypour.happypour.model.Drink;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DrinkRepository extends JpaRepository<Drink, Long>{

    @Query("SELECT d FROM Drink d WHERE d.name = ?1")
    public Drink findByName(String name);
    
    @Query("SELECT d FROM Drink d WHERE d.bar = ?1")
    public List<Drink> findByBar(Long id);
}
