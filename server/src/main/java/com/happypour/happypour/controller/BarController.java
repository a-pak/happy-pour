package com.happypour.happypour.controller;

import com.happypour.happypour.dto.BarDetailsRequest;
import com.happypour.happypour.dto.BarListRequest;
import com.happypour.happypour.model.Bar;
import com.happypour.happypour.service.BarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bars")
@CrossOrigin(origins={
    "https://happy-pour-be.onrender.com",
    "http://localhost:8080", 
    "http://localhost:5173",
    "http://localhost:3000", 
})
public class BarController {

    @Autowired
    private BarService barService;

    @GetMapping
    public List<BarDetailsRequest> getBars() {
        return barService.getAllBars();
    }
    @PostMapping
    public ResponseEntity<String> createBar(@RequestBody BarDetailsRequest request) {
        System.out.println("HALOOOOOO");
        try {
            System.out.println("request::::" + request);
            barService.setBar(request.getBar(), request.getDrinks(), request.getHappyHour(), request.getHappyHourDrinks());
            return ResponseEntity.ok("Bar added succesfully to database.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error adding bar: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarDetailsRequest> getBar(@PathVariable Long id) {
        BarDetailsRequest bar = barService.getById(id);
        if (bar == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(bar);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bar> updateBar(
            @PathVariable Long id,
            @RequestBody Bar updatedBar) {
        Bar bar = barService.updateBar(id, updatedBar);

        if (bar == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(bar);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeBar(@PathVariable Long id) {
        return barService.removeBar(id);
    }
}
