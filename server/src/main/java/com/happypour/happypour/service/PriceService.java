package com.happypour.happypour.service;

import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.happypour.happypour.dto.PriceDTO;
import com.happypour.happypour.model.Bar;
import com.happypour.happypour.model.Price;
import com.happypour.happypour.model.User;
import com.happypour.happypour.model.Drink;
import com.happypour.happypour.model.HappyHour;
import com.happypour.happypour.repository.PriceRepository;

@Service
public class PriceService {

    @Autowired
    private PriceRepository priceRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private BarService barService;
    @Autowired
    private DrinkService drinkService;
    @Autowired
    private HappyHourService happyHourService;

    public List<Price> getAllPrices() {
        return priceRepository.findAll();
    }
    public List<PriceDTO> getAllPriceDTOs() {
        List<Price> prices = priceRepository.findAll();
        if(prices.isEmpty()) return null;

        List<PriceDTO> priceDTOs = new ArrayList<>();
        prices.forEach(price -> priceDTOs.add(new PriceDTO(price)));
        return priceDTOs;
    }
    public List<Price> getByBarId(Long barId) {
        return priceRepository.findByBar(barId);
    }

    public List<PriceDTO> getDTOsByBarId(Long barId) {
        List<Price> prices = priceRepository.findByBar(barId);
        if(prices.isEmpty()) return null;

        List<PriceDTO> priceDTOs = new ArrayList<>();
        prices.forEach(price -> priceDTOs.add(new PriceDTO(price)));
        return priceDTOs;
    }

    public List<PriceDTO> getDtoByHappyHourId(Long happyHourId) {
        List<Price> prices = priceRepository.findByHappyHourId(happyHourId);
        if(prices.isEmpty()) return null;

        List<PriceDTO> priceDTOs = new ArrayList<>();
        prices.forEach(price -> priceDTOs.add(new PriceDTO(price)));
        return priceDTOs;
    }

    public void createPrice(List<PriceDTO> priceDtos) {
        User user = userService.getById(priceDtos.get(0).getCreatorId());
        if(user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");

        Bar bar = barService.getById(priceDtos.get(0).getBarId());
        if(bar == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bar not found");

        for(PriceDTO dto : priceDtos) {
            Optional<Price> existing = priceRepository.findExistingPrice(bar.getId(), dto.getDrinkId(), dto.getHappyHourId());
            if (existing.isPresent()) {
                updatePrice(dto);
                continue;
            }

            Drink drink = drinkService.getById(dto.getDrinkId());
            HappyHour happyHour = dto.getHappyHourId() != null ? 
                    happyHourService.getById(dto.getHappyHourId()) : null;

            Price price = Price.builder()
                .price(dto.getPrice().setScale(2, RoundingMode.UNNECESSARY))
                .bar(bar)
                .drink(drink)
                .happyHour(happyHour)
                .createdBy(user)
                .updatedBy(user)
                .build();

            priceRepository.save(price);
        }
    }
    
    public Price updatePrice(PriceDTO priceDTO) {
        Optional<Price> existingPrice = priceRepository.findById(priceDTO.getId());
        if (existingPrice.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Price not found");

        existingPrice.get().setPrice(priceDTO.getPrice().setScale(2, RoundingMode.UNNECESSARY));
        
        User user = userService.getById(priceDTO.getCreatorId());
        if(user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        
        existingPrice.get().setUpdatedBy(user);
        priceRepository.save(existingPrice.get());
        return priceRepository.findById(priceDTO.getId()).get();
    }

    public void deleteById(Long id) {
        priceRepository.deleteById(id);
    }
}