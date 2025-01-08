package com.happypour.happypour.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.happypour.happypour.model.Bar;
import org.springframework.stereotype.Repository;

@Repository
public interface BarRepository extends JpaRepository<Bar, Long> {

}
