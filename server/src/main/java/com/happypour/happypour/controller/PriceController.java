package com.happypour.happypour.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.happypour.happypour.dto.PriceDTO;
import com.happypour.happypour.model.Price;
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
        try {
            List<PriceDTO> priceDTOs = priceService.getAllPriceDTOs();
            return ResponseEntity.ok(priceDTOs);
        } catch (Exception e) {
            System.err.println("ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
       
    }

    @GetMapping("/by-bar/{barId}")
    public ResponseEntity<List<PriceDTO>> getByBar(@PathVariable Long barId) {
        try {
            List<PriceDTO> priceDTOs = priceService.getDTOsByBarId(barId);
            if (priceDTOs != null) {
                return ResponseEntity.ok(priceDTOs);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    

    @GetMapping("/by-happy-hour/{happyHourId}")
    public ResponseEntity<List<PriceDTO>> getByHappyHour(@PathVariable Long happyHourId) {
        try {
            List<PriceDTO> priceDTOs = priceService.getDtoByHappyHourId(happyHourId);
            if (priceDTOs != null) {
                return ResponseEntity.ok(priceDTOs);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<String> createPrice(@RequestBody List<PriceDTO> priceDtos) {
        try {
            priceService.createPrice(priceDtos);
            return ResponseEntity.ok("Prices created succefully");
        } catch (Exception e) {
            System.err.println("ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping
    public ResponseEntity<String> updatePrice(@RequestBody PriceDTO priceDto) {
        try {
            Price updatedPrice = priceService.updatePrice(priceDto);
            if(updatedPrice == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok("Price updated with id: " + updatedPrice.getId());
        } catch (Exception e) {
            System.err.println("ERROR: \n");
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

}
