package com.happypour.happypour.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.happypour.happypour.dto.HappyHourDTO;
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
    public ResponseEntity<HappyHourDTO> getHappyHour(@PathVariable Long id) {
        HappyHourDTO happyHourDTO = happyHourService.getHappyHourDTOById(id);
        return ResponseEntity.ok(happyHourDTO); 
    }

    @GetMapping("/by-bar/{barId}")
    public ResponseEntity<List<HappyHourDTO>> getHappyHoursByBar(@PathVariable Long barId) {
        return ResponseEntity.ok().body(happyHourService.getDTOsByBarId(barId)); 
    }

    @PostMapping
    public ResponseEntity<HappyHourDTO> createHappyHour(@RequestBody HappyHourDTO dto) {
        HappyHourDTO createdHappyHour = happyHourService.createHappyHour(dto);
        return ResponseEntity.ok(createdHappyHour);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<String> updateHappyHour(@PathVariable Long id, @RequestBody HappyHourDTO dto) {
        happyHourService.updateHappyHour(id, dto);
        return ResponseEntity.ok("Happy hour updated with id: " + id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHappyHour(@PathVariable Long id) {
        happyHourService.deleteHappyHour(id);
        return ResponseEntity.ok().body("Happy hour with id " + id + " deleted succesfully.");
    }

}
