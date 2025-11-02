package com.happypour.happypour.controller;

import com.happypour.happypour.dto.BarDTO;
import com.happypour.happypour.dto.BarDataDTO;
import com.happypour.happypour.service.BarDataService;
import com.happypour.happypour.service.BarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


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
    @GetMapping("/by-location")
    public List<BarDataDTO> getMethodName(@RequestParam double lat, @RequestParam double lon) {
        return barDataService.getBarsByLocation(lat, lon);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BarDataDTO> getBar(@PathVariable Long id) {
        BarDataDTO barDataDTO = barDataService.getDataDtoById(id);
        return ResponseEntity.ok(barDataDTO); 
    }

    @PostMapping
    public ResponseEntity<BarDTO> createBar(@RequestBody BarDTO barDto) {
        BarDTO createdBar = barService.createBar(barDto);
        return ResponseEntity.ok(createdBar);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateBar(@PathVariable Long id,@RequestBody BarDTO bar) {
        barService.updateBar(id, bar);
        return ResponseEntity.ok("Bar with id " + id + " updated successfully.");    
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBar(@PathVariable Long id) {
        barService.removeBar(id);
        return ResponseEntity.ok("Bar with id " + id + " deleted successfully.");
    }
}
