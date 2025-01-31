package com.happypour.happypour.service;

import com.happypour.happypour.model.Bar;
import com.happypour.happypour.repository.BarRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BarService {

    @Autowired
    private BarRepository barRepository;

    public List<Bar> getAllBars() {
        List<Bar> bars = barRepository.findAll();
        bars.forEach(bar -> System.out.println(bar.toString()));

        return bars;
    }

    public Bar getBar(Long id) {
         Optional<Bar> bar = barRepository.findById(id);
         System.out.println("Fetching bar: " + bar);
         return bar.orElse(null);
    }

    public void setBar(Bar bar) {
        System.out.println("BarService: Adding bar: " + bar.toString());
        bar.setId(null);
        barRepository.save(bar);
    }

    public Bar updateBar(Long id, Bar updatedBar) {
        return barRepository.findById(id)
                .map(existingBar -> {
                    BeanUtils.copyProperties(updatedBar, existingBar, "id");
                    return barRepository.save(existingBar);
                })
                .orElse(null);
    }


    public ResponseEntity<String> removeBar(Long id) {
        if (!barRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        barRepository.deleteById(id);
        return ResponseEntity.ok("Bar with ID " + id + " deleted.");
    }
}