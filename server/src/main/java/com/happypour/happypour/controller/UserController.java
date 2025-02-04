package com.happypour.happypour.controller;

import com.happypour.happypour.model.User;
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
    public ResponseEntity<User> getByName(@RequestHeader(value="Authorization") String authorizationHeader, @RequestParam String username) {
        String token = "";
        System.out.println(authorizationHeader);
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(0,7);
            System.err.println("Token from header:" + token);
        }

            User user = userService.getByUsername(username);

            if (user != null && userService.matchUser(user.getEmail(), token)) {
                return ResponseEntity.ok(user);

            } else if (user == null) {
                return ResponseEntity.notFound().build();
            }

        return ResponseEntity.badRequest().build();
    }
}
