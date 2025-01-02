package com.happypour.happypour.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.happypour.happypour.model.Bar;

public interface BarRepository extends JpaRepository<Long, Bar> {

}
