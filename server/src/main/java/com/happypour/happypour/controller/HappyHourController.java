package com.happypour.happypour.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.happypour.happypour.dto.HappyHourDTO;
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
    public ResponseEntity<HappyHourDTO> getHappyHour(@PathVariable Long id) {
        try {
            HappyHourDTO happyHourDTO = happyHourService.getHappyHourDTOById(id);
            if (happyHourDTO != null) {
                return ResponseEntity.ok(happyHourDTO);
            
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> createHappyHour(@RequestBody HappyHourDTO dto) {
        try {
            HappyHour createdHappyHour = happyHourService.createHappyHour(dto);
            return ResponseEntity.ok("Happy hour created with id: " + createdHappyHour.getId());

        } catch (Exception e) {
            System.err.println("ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping
    public ResponseEntity<String> updateHappyHour(@PathVariable Long id, @RequestBody HappyHourDTO dto) {
        try {
            HappyHour updatedHappyHour = happyHourService.updateHappyHour(id, dto);
            if(updatedHappyHour == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok("Happy hour updated with id: " + updatedHappyHour.getId());
        } catch (Exception e) {
            System.err.println("ERROR: \n");
            e.printStackTrace();
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
