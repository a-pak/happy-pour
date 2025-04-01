package com.happypour.happypour.controller;

import com.happypour.happypour.dto.DrinkDTO;
import com.happypour.happypour.dto.DrinkPostRequest;
import com.happypour.happypour.model.Drink;
import com.happypour.happypour.service.DrinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
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

    @GetMapping("/{bar_id}")
    public ResponseEntity<List<DrinkDTO>> getDrinks(@PathVariable Long bar_id) {
        try {
            List<DrinkDTO> drinks = drinkService.findByBar(bar_id);
            return ResponseEntity.ok(drinks);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> postDrinks(@RequestBody DrinkPostRequest drinkPostRequest) {
        System.out.println("DRINKPOSTREEEEEEE:" + (drinkPostRequest.getDrinks()[0].getName().toString()));
        try {
            drinkService.createDrink(drinkPostRequest);
            return ResponseEntity.ok("Drinks added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    @PutMapping
    public ResponseEntity<String> updateDrinks(@RequestBody DrinkPostRequest drinkPostRequest) {
        try {
            List<Drink> drinks = Arrays.stream(drinkPostRequest.getDrinks()).toList();
            for (Drink d : drinks) {
                drinkService.updateDrink(d);
            }
            return ResponseEntity.ok("Drinks updated Successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    @DeleteMapping
    public ResponseEntity<String> deleteDrinks(@RequestBody DrinkPostRequest drinkPostRequest) {
        try {
            List<Drink> drinks = Arrays.stream(drinkPostRequest.getDrinks()).toList();
            for (Drink d: drinks) {
                drinkService.deleteDrink(d);
            }
            return ResponseEntity.ok("Drinks deleted succesfully!");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("FAIL: Deletion of drinks failed!" + e.getMessage());
        }
    }
}