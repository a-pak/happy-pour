package com.happypour.happypour.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.happypour.happypour.model.HappyHour;
import com.happypour.happypour.service.HappyHourService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/happyhours")
public class HappyHourController {

    @Autowired
    private HappyHourService happyHourService;

    @GetMapping("/{id}")
    public ResponseEntity<HappyHour> getHappyHour(@PathVariable Long id) {
        try {
            HappyHour happyHour = happyHourService.getById(id);
            if (happyHour != null) {
                return ResponseEntity.ok(happyHour);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<HappyHour> createHappyHour(@RequestBody HappyHour happyHour) {
        try {
            HappyHour createdHappyHour = happyHourService.createHappyHour(happyHour);
            return ResponseEntity.ok(createdHappyHour);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<HappyHour> updateHappyHour(@PathVariable Long id, @RequestBody HappyHour happyHour) {
        try {
            HappyHour updatedHappyHour = happyHourService.updateHappyHour(id, happyHour);
            if(updatedHappyHour == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedHappyHour);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHappyHour(@PathVariable Long id) {
        if(happyHourService.getById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            happyHourService.deleteHappyHour(id);
            return ResponseEntity.ok().body("Happy hour with id " + id + " deleted succesfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
