package com.happypour.happypour.controller;

import com.happypour.happypour.entity.User;
import com.happypour.happypour.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/get-by-username")
    public ResponseEntity<User> getByName(@RequestParam String username) {

        try {
            User user = userService.getByUsername(username);

            if (user != null) {
                return ResponseEntity.ok(user);

            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {

        return ResponseEntity.badRequest().build();
        }
    }
}
