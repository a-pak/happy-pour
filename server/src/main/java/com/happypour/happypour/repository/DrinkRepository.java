package com.happypour.happypour.repository;

import com.happypour.happypour.model.Drink;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DrinkRepository extends JpaRepository<Drink, Long>{

    @Query("SELECT d FROM Drink d WHERE d.name = ?1")
    Drink findByName(String name);

    Drink findById(long id);

    @Transactional
    @Modifying
    @Query("DELETE from Drink d where d.id = ?1")
    void deleteById(long id);
}
