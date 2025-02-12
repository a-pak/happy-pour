package com.happypour.happypour.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.happypour.happypour.model.Bar;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BarRepository extends JpaRepository<Bar, Long> {
    @Modifying
    @Transactional
    @Query("delete from Bar b where b.id= ?1")
    void deleteById(Long id);
}
