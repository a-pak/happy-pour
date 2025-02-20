package com.happypour.happypour.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.happypour.happypour.model.Bar;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BarRepository extends JpaRepository<Bar, Long> {
    @Modifying
    @Transactional
    @Query("delete from Bar b where b.id= ?1")
    void deleteById(Long id);

    /** <h4>findByLocation</h4> looks for bars in a 3km distances from given location.
     *
     * @return List of Bars 3km distance from given location
     */
    @Query("SELECT Bar FROM Bar b " +
            "WHERE b.coordLat BETWEEN ?1 - 0.01795 AND ?1 + 0.01795" +
            "AND b.coordLong BETWEEN ?1 - 0.01795 AND ?1 + 0.01795")
    List<Bar> findByLocation(double Lat, double Long);
}
