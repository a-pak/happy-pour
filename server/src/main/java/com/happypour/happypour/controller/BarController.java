package com.happypour.happypour.controller;

import com.happypour.happypour.dto.BarDTO;
import com.happypour.happypour.dto.BarDataDTO;
import com.happypour.happypour.service.BarDataService;
import com.happypour.happypour.service.BarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bars")
public class BarController {

    @Autowired
    private BarService barService;

    @Autowired
    private BarDataService barDataService;

    @GetMapping
    public List<BarDataDTO> getBars() {
        return barDataService.getAllBars();
    }

    @PostMapping
    public ResponseEntity<BarDTO> createBar(@RequestBody BarDTO barDto) {
        System.out.println("Received bar creation request: " + barDto.toString());
        try {
            BarDTO createdBar = barService.createBar(barDto);
            return ResponseEntity.ok(createdBar);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarDataDTO> getBar(@PathVariable Long id) {
        BarDataDTO barDataDTO = barDataService.getDataDtoById(id);
        if (barDataDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(barDataDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BarDTO> updateBar(
            @PathVariable Long id,
            @RequestBody BarDTO bar) {
        BarDTO updatedBar = barService.updateBar(id, bar);

        if (updatedBar == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedBar);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBar(@PathVariable Long id) {
        if(barService.getById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            barService.removeBar(id);
            return ResponseEntity.ok("Bar with id " + id + " deleted successfully.");
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                return ResponseEntity.status(404).body(e.getMessage());
            } else if (e instanceof RuntimeException) {
                return ResponseEntity.status(500).body(e.getMessage());
            }
            return ResponseEntity.internalServerError().body("Error deleting bar with id " + id);
        }
    }
}
