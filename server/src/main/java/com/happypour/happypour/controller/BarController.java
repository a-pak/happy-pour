package com.happypour.happypour.controller;

import com.happypour.happypour.dto.BarGetRequest;
import com.happypour.happypour.dto.BarPutRequest;
import com.happypour.happypour.model.Bar;
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

    @GetMapping
    public List<BarGetRequest> getBars() {
        return barService.getAllBars();
    }

    @PostMapping
    public ResponseEntity<Bar> createBar(@RequestBody Bar request) {
        try {
            Bar createdBar = barService.createBar(request);
            return ResponseEntity.ok(createdBar);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarGetRequest> getBar(@PathVariable Long id) {
        BarGetRequest bar = barService.getById(id);
        if (bar == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(bar);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bar> updateBar(
            @PathVariable Long id,
            @RequestBody BarPutRequest barPutRequest) {
        Bar bar = barService.updateBar(id, barPutRequest);

        if (bar == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(bar);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBar(@PathVariable Long id) {
        return barService.removeBar(id);
    }
}
