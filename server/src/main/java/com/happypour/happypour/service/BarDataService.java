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

        return assembleBarData(bars, happyHours, prices);
    }


    /**
     * Fetches bars with coordinates within a certain area from given coordinates (Latitude & Longitude).
     * Creates a List of BarData aggregate DTOs of bars and all related entities.  
     * @param lat Latitude
     * @param lon Longitude
     * @return List of BarData aggregate DTOs.
     */
    public List<BarDataDTO> getBarsByLocation(
        double lat, 
        double lon
    ) {
        List<Bar> bars = barService.getByLocation(lat, lon);
        List<HappyHour> happyHours = happyHourService.getAll();
        List<Price> prices = priceService.getAllPrices();

        return assembleBarData(bars, happyHours, prices);
    }


    /**
     * Fetches bar with given id with its related entities and returns an aggregate BarDataDTO.
     * @return BarData aggregate dto
     */
    public BarDataDTO getDataDtoById(Long id) {
        Bar bar = barService.getById(id);
        if (bar == null) { 
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Bar with id "+id+" not found"
            );
        }

        List<HappyHour> happyHours = happyHourService.getByBarId(bar.getId());
        List<Price> prices = priceService.getByBarId(bar.getId());

        List<BarDataDTO> barList = assembleBarData(List.of(bar), happyHours, prices);
        
        // If the list is empty, return null, otherwise return the first BarDataDTO
        return barList.isEmpty() ? null : barList.get(0);
    }
    

    /**
     * Helper method for assembling BarDataDTOs from given lists of entities.
     * @param bars List of Bar entities
     * @param happyHours List of HappyHour entities
     * @param prices List of Price entities
     * @return List of BarDataDTOs with related entities mapped to DTOs.
     */
    private List<BarDataDTO> assembleBarData(
        List<Bar> bars, 
        List<HappyHour> happyHours, 
        List<Price> prices
    ) {
        List<BarDataDTO> barDataDTOs = new ArrayList<>();

        for (Bar b : bars) {
            BarDataDTO barDataDto = new BarDataDTO();
            BarDTO barDto = BarMapper.toDTO(b);
            barDataDto.setBar(barDto);

            for (HappyHour hh : happyHours) {
                if (hh.getBar().getId() == b.getId()) {
                    List<Price> associatedPrices = getPricesAssociatedWithHappyHour(hh.getId(), prices);
                    HappyHourDTO hhDto = HappyHourMapper.toDTO(hh, associatedPrices);
                    barDataDto.getHappyHours().add(hhDto);
                }
            }

            prices.forEach(p -> {
                if (p.getHappyHour() == null && p.getBar() == b) {
                    barDataDto.getPrices().add(PriceMapper.toDTO(p));
                }
            });

            barDataDTOs.add(barDataDto);
        }

        return barDataDTOs;
    }


    /**
     * Helper method for filtering prices associated with happy hour
     * @param hhId Id of happy hour
     * @param prices List of Price entity
     * @return List of Price entitys with matching happy hour id.
     */
    private List<Price> getPricesAssociatedWithHappyHour(
        Long hhId, 
        List<Price> prices
    ) {
        List<Price> associatedPrices = new ArrayList<Price>();
        for (Price price : prices) {
            if(price.getHappyHour() == null) continue;

            if(price.getHappyHour().getId() == hhId) {
                associatedPrices.add(price);
            }
        }
        return associatedPrices;
    }
}