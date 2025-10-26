package com.happypour.happypour.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.happypour.happypour.dto.PriceDTO;
import com.happypour.happypour.service.PriceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/api/prices")
public class PriceController {
    @Autowired
    private PriceService priceService;

    @GetMapping
    public ResponseEntity<List<PriceDTO>> getAll() {
        List<PriceDTO> priceDTOs = priceService.getAllPriceDTOs();
        return ResponseEntity.ok(priceDTOs);  
    }

    @GetMapping("/by-bar/{barId}")
    public ResponseEntity<List<PriceDTO>> getByBar(@PathVariable Long barId) {
        List<PriceDTO> priceDTOs = priceService.getDTOsByBarId(barId);
        return ResponseEntity.ok(priceDTOs);
    }
    

    @GetMapping("/by-happy-hour/{happyHourId}")
    public ResponseEntity<List<PriceDTO>> getByHappyHour(@PathVariable Long happyHourId) {
        List<PriceDTO> priceDTOs = priceService.getDtoByHappyHourId(happyHourId);
        return ResponseEntity.ok(priceDTOs);
    }
    
    @PostMapping
    public ResponseEntity<String> createPrice(@RequestBody List<PriceDTO> priceDtos) {
        priceService.createPrice(priceDtos);
        return ResponseEntity.ok("Prices created succefully");
    }
    
    @PutMapping
    public ResponseEntity<String> updatePrice(@RequestBody PriceDTO priceDto) {
        priceService.updatePrice(priceDto);
        return ResponseEntity.ok("Price updated with id: " + priceDto.getId());
    }

}
