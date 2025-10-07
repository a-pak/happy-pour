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
        try {
            List<DrinkDTO> dtos = drinkService.getAllDTOs();
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> postDrinks(@RequestBody List<DrinkDTO> drinkPostRequest) {
        try {
            drinkService.createDrink(drinkPostRequest);
            return ResponseEntity.ok("Drinks added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateDrinks(@PathVariable Long id, @RequestBody DrinkDTO drinkDto) {
        try {
            drinkService.updateDrink(id, drinkDto);
            return ResponseEntity.ok("Drinks updated Successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Update failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDrinks(@PathVariable Long drinkId) {
        try {
            drinkService.deleteDrink(drinkId);
            return ResponseEntity.ok("Drinks deleted succesfully!");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("FAIL: Deletion of drinks failed!" + e.getMessage());
        }
    }
}