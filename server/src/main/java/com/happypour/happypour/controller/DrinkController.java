package com.happypour.happypour.controller;

import com.happypour.happypour.dto.DrinkDTO;
import com.happypour.happypour.service.DrinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drinks")
@CrossOrigin(origins={
        "https://happy-pour-be.onrender.com",
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:3000",
})
public class DrinkController {

    @Autowired
    private DrinkService drinkService;
   
    @GetMapping
    public ResponseEntity<List<DrinkDTO>> getAllDrinks() {
        List<DrinkDTO> dtos = drinkService.getAllDTOs();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<String> postDrinks(@RequestBody List<DrinkDTO> drinkPostRequest) {
        drinkService.createDrink(drinkPostRequest);
        return ResponseEntity.ok("Drinks added successfully!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateDrinks(@PathVariable Long id, @RequestBody DrinkDTO drinkDto) {
        drinkService.updateDrink(id, drinkDto);
        return ResponseEntity.ok("Drinks updated Successfully!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDrinks(@PathVariable Long drinkId) {
        drinkService.deleteDrink(drinkId);
        return ResponseEntity.ok("Drinks deleted succesfully!");
    }
}