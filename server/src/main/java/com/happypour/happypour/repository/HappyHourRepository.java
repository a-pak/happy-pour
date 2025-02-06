package com.happypour.happypour.repository;

import com.happypour.happypour.model.HappyHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HappyHourRepository extends JpaRepository<HappyHour, Long> {

}
