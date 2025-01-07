package com.happypour.happypour.service;

import com.happypour.happypour.model.Bar;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class BarService {
    private List<Bar> bars = new ArrayList<>();

    public List<Bar> getAllBars() {
        return bars;
    }

    public void setBar(Bar bar) {
        this.bars.add(bar);
        System.out.println("baariiiit: " +
                bars.stream()
                        .map(Bar::getName) // Tulostetaan vain nimet
                        .toList()          // Muutetaan takaisin listaksi
        );
    }
}
