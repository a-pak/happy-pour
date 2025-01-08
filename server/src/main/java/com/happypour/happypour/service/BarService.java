package com.happypour.happypour.service;

import com.happypour.happypour.model.Bar;
import com.happypour.happypour.repository.BarRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BarService {
    //private List<Bar> bars = new ArrayList<>();

    @Autowired
    private BarRepository barRepository;

    public List<Bar> getAllBars() {
        List<Bar> bars = barRepository.findAll();
        bars.forEach(bar -> System.out.println(bar.toString()));

        return bars;
    }

    public void setBar(Bar bar) {
        System.out.println(bar.toString());
        System.out.println("!!!!!!!!!!!!!!!!!!!! Set bar called! \n");
        bar.setId(null);
        barRepository.save(bar);
    }

    // public List<Bar> getAllBars() {
    //     return bars;
    // }



    // public void setBar(Bar bar) {
    //     this.bars.add(bar);
    //     System.out.println("baariiiit: " +
    //             bars.stream()
    //                     .map(Bar::getName) // Tulostetaan vain nimet
    //                     .toList()          // Muutetaan takaisin listaksi
    //     );
    // }
}
