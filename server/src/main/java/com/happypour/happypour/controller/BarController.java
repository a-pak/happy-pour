package com.happypour.happypour.controller;

import com.happypour.happypour.model.Bar;
import com.happypour.happypour.service.BarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bars")
@CrossOrigin(origins={"http://localhost:3000", "http://localhost:5173"})
public class BarController {

    @Autowired
    private BarService barService;

    @GetMapping
    public List<Bar> getBars() {
        return barService.getAllBars();
    }
    @GetMapping("/get-by-id")
    public ResponseEntity<Bar> getById (@RequestParam long id) {
        Bar bar = barService.getById(id);
        if (bar != null){
           return ResponseEntity.ok(bar);
        }
        return ResponseEntity.notFound().build();
    }
    @PostMapping
    public Bar addBar(@RequestBody Bar newBar) {
        System.out.println("!! addBar called: \n " + newBar);
        barService.setBar(newBar);
        return newBar;
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
}
