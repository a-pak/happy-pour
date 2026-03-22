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
import com.happypour.happypour.entity.Bar;
import com.happypour.happypour.entity.HappyHour;
import com.happypour.happypour.entity.Price;
import com.happypour.happypour.mapper.BarMapper;
import com.happypour.happypour.mapper.HappyHourMapper;
import com.happypour.happypour.mapper.PriceMapper;

@Service
public class BarDataService {
    @Autowired
    private BarService barService;
    @Autowired
    private HappyHourService happyHourService;
    @Autowired
    private PriceService priceService;
    /**
     * Fetches all bars and related entities from database and creates a list of aggregate dtos (BarDataDTO).
     * @return List of bar aggregate dtos
     */
    public List<BarDataDTO> getAllBars() {
        List<Bar> bars = barService.getAll();
        List<HappyHour> happyHours = happyHourService.getAll();
        List<Price> prices = priceService.getAllPrices();

        List<BarDataDTO> barDataDTOs = new ArrayList<>();

        for (Bar b : bars) {
            BarDataDTO barDataDto = new BarDataDTO();
            BarDTO barDto = BarMapper.toDTO(b);
            barDataDto.setBar(barDto);
            
            // Get Happy hours associated with this bar
            for (HappyHour hh : happyHours) {
                if(hh.getBar().getId() == b.getId()) {
                    // Get prices associated with happy hour
                    List<Price> associatedPrices = getPricesAssociatedWithHappyHour(hh.getId(), prices);
                    HappyHourDTO hhDto = HappyHourMapper.toDTO(hh, associatedPrices);
                    barDataDto.getHappyHours().add(hhDto);
                }
            }
            
            // Get Normal prices associated with this bar
            prices.forEach(p -> {
                if(p.getHappyHour() == null) {
                    
                    if(p.getBar() == b) barDataDto.getPrices().add(PriceMapper.toDTO(p));
                }
            });
            barDataDTOs.add(barDataDto);
        }

        return barDataDTOs;
    }
    /**
     * Fetches bars with coordinates within a certain area from given coordinates (Latitude & Longitude).
     * Creates a List of BarData aggregate DTOs of bars and all related entities.  
     * @param lat Latitude
     * @param lon Longitude
     * @return List of BarData aggregate DTOs.
     */
    public List<BarDataDTO> getBarsByLocation(double lat, double lon) {
        System.out.println("2. BARDATA: Fetching bars near location: lat=" + lat + ", lon=" + lon);
        List<Bar> bars = barService.getByLocation(lat, lon);
        List<HappyHour> happyHours = happyHourService.getAll();
        List<Price> prices = priceService.getAllPrices();

        List<BarDataDTO> barDataDTOs = new ArrayList<>();

        for (Bar b : bars) {
            BarDataDTO barDataDto = new BarDataDTO();
            BarDTO barDto = BarMapper.toDTO(b);
            barDataDto.setBar(barDto);
            
            // Get Happy hours associated with this bar
            for (HappyHour hh : happyHours) {
                if(hh.getBar().getId() == b.getId()) {
                    List<Price> associatedPrices = getPricesAssociatedWithHappyHour(hh.getId(), prices);
                    HappyHourDTO hhDto = HappyHourMapper.toDTO(hh, associatedPrices);
                    barDataDto.getHappyHours().add(hhDto);
                }
            }
            
            // Get Normal prices associated with this bar
            prices.forEach(p -> {
                if(p.getHappyHour() == null) {
                    
                    if(p.getBar() == b) barDataDto.getPrices().add(PriceMapper.toDTO(p));
                }
            });
            barDataDTOs.add(barDataDto);
        }

        return barDataDTOs;
    }
    /**
     * Fetches bar with given id with its related entities and returns an aggregate BarDataDTO.
     * @return BarData aggregate dto
     */
    public BarDataDTO getDataDtoById(Long id) {
        Bar bar = barService.getById(id);
        if (bar == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bar with id "+id+" not found");

        BarDataDTO barDataDto = new BarDataDTO();
        BarDTO barDto = BarMapper.toDTO(bar);
        barDataDto.setBar(barDto);
        List<Price> prices = priceService.getByBarId(bar.getId());

        // Set Happy hours associated with this bar
        List <HappyHour> happyHours = happyHourService.getByBarId(bar.getId());
        if(!happyHours.isEmpty()) {
            for (HappyHour hh : happyHours) {
                List<Price> associatedPrices = getPricesAssociatedWithHappyHour(hh.getId(), prices);
                HappyHourDTO hhDto = HappyHourMapper.toDTO(hh, associatedPrices);
                
                barDataDto.getHappyHours().add(hhDto);
            }
        }
        
        // Set Normal prices associated with this bar
        prices.forEach(p -> {
            if(p.getHappyHour() == null) {
                barDataDto.getPrices().add(PriceMapper.toDTO(p));
            }
        });
        return barDataDto;
    }
    /**
     * Helper method for filtering prices associated with happy hour
     * @param hhId Id of happy hour
     * @param prices List of Price entity
     * @return List of Price entitys with matching happy hour id.
     */
    private List<Price> getPricesAssociatedWithHappyHour(Long hhId, List<Price> prices) {
        List<Price> associatedPrices = new ArrayList<Price>();
        // Get Happy hour prices associated with this happy hour
        for (Price price : prices) {
            if(price.getHappyHour() == null) continue; // Skip price if no happy hour

            if(price.getHappyHour().getId() == hhId) {
                associatedPrices.add(price);
            }
        }
        return associatedPrices;
    }
}
