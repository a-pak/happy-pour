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
    void deleteById(long id);

    /** <h4>findByLocation</h4> looks for bars in an 8 km distance from the given location.
     *
     * @return List of Bars 8 km distance from the given location
     */
    @Query("SELECT b FROM Bar b " +
        "WHERE b.coordLat BETWEEN ?1 - 0.072 AND ?1 + 0.072 " +
        "AND b.coordLong BETWEEN ?2 - 0.072 AND ?2 + 0.072")
    List<Bar> findByLocation(double lat, double lon);

}
