package com.happypour.happypour.controller;

import com.happypour.happypour.model.Bar;
import com.happypour.happypour.service.BarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bars")
@CrossOrigin(origins="http://localhost:5173")
public class BarController {

    @Autowired
    private BarService barService;

    @GetMapping
    public List<Bar> getBars() {
        return barService.getAllBars();
    }

    @PostMapping
    public Bar addBar(@RequestBody Bar newBar) {
        System.out.println("BAARIIII: \n " + newBar);
        barService.setBar(newBar);
        return newBar;
    }
}
