package com.happypour.happypour.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.happypour.happypour.dto.BarDTO;
import com.happypour.happypour.dto.BarDataDTO;
import com.happypour.happypour.dto.HappyHourDTO;
import com.happypour.happypour.dto.PriceDTO;
import com.happypour.happypour.model.Bar;
import com.happypour.happypour.model.HappyHour;
import com.happypour.happypour.model.Price;

@Service
public class BarDataService {
    @Autowired
    private BarService barService;
    @Autowired
    private HappyHourService happyHourService;
    @Autowired
    private PriceService priceService;

    public List<BarDataDTO> getAllBars() {
        List<Bar> bars = barService.getAll();
        List<HappyHour> happyHours = happyHourService.getAll();
        List<Price> prices = priceService.getAllPrices();

        List<BarDataDTO> barDataDTOs = new ArrayList<>();

        for (Bar b : bars) {
            BarDataDTO barDataDto = new BarDataDTO();
            BarDTO barDto = new BarDTO(b);
            barDataDto.setBar(barDto);
            
            // Get Happy hours associated with this bar
            for (HappyHour hh : happyHours) {
                if(hh.getBar().getId() == b.getId()) {
                    HappyHourDTO hhDto = new HappyHourDTO(hh);
                    
                    // Get Happy hour prices associated with this happy hour
                    for (Price price : prices) {
                        if(price.getHappyHour() == null) continue; // Skip price if no happy hour

                        if(price.getHappyHour().getId() == hh.getId()) {
                            PriceDTO priceDTO = new PriceDTO(price);
                            hhDto.getPrices().add(priceDTO);
                        }
                    }
                    barDataDto.getHappyHours().add(hhDto);
                }
            }
            
            // Get Normal prices associated with this bar
            prices.forEach(p -> {
                if(p.getHappyHour() == null) {
                    
                    if(p.getBar() == b) barDataDto.getPrices().add(new PriceDTO(p));
                }
            });
            barDataDTOs.add(barDataDto);
        }

        return barDataDTOs;
    }

    public BarDataDTO getDataDtoById(Long id) {
        Bar bar = barService.getById(id);
        if (bar == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bar with id "+id+" not found");

        BarDataDTO barDataDto = new BarDataDTO();
        BarDTO barDto = new BarDTO(bar);
        barDataDto.setBar(barDto);
        List<Price> prices = priceService.getByBarId(bar.getId());

        // Set Happy hours associated with this bar
        List <HappyHour> happyHours = happyHourService.findByBarId(bar.getId());
        if(!happyHours.isEmpty()) {
            for (HappyHour hh : happyHours) {
                HappyHourDTO hhDto = new HappyHourDTO(hh);
                
                // Set Happy hour prices associated with this happy hour
                for (Price price : prices) {
                    if(price.getHappyHour() != null && price.getHappyHour().getId() == hh.getId()) {
                        hhDto.getPrices().add(new PriceDTO(price));
                    }
                }
                barDataDto.getHappyHours().add(hhDto);
            }
        }
        
        // Set Normal prices associated with this bar
        prices.forEach(p -> {
            if(p.getHappyHour() == null) {
                barDataDto.getPrices().add(new PriceDTO(p));
            }
        });
        return barDataDto;
    }
}
