package com.happypour.happypour.controller;

import com.happypour.happypour.dto.LoginRequest;
import com.happypour.happypour.dto.RegisterRequest;
import com.happypour.happypour.security.JWTUtil;
import com.happypour.happypour.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final JWTUtil jwtUtil;
    @Autowired
    public AuthController(UserService us, JWTUtil jt){
        this.userService = us;
        this.jwtUtil = jt;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login (@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        if (userService.authenticate(email, password)) {
            String username = userService.getByEmail(email).getUsername();

            return ResponseEntity.ok(jwtUtil.generateToken(username));
        } else {
            return ResponseEntity.status(401).body("Invalid username or password.");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> login(@RequestBody RegisterRequest registerRequest) {
        String email = registerRequest.getEmail();
        String username = registerRequest.getUsername();
        String password = registerRequest.getPassword();
        
        if (userService.userExistsByEmail(email)) {
            return ResponseEntity.status(409).body("User email is already in use!");

        } else if (userService.userExistsByUsername(username)) {
            return ResponseEntity.status(409).body("Username is already in use!");

        } else if (email == null || username == null || password == null) {
            return ResponseEntity.status(400).body("A valid user needs an email, username and password.");
        
        } else {
            if( !userService.registerUser(registerRequest) ) {
                return ResponseEntity.status(500).body("Unexpected error while writing user to database.");
            
            };
            
            return ResponseEntity.status(201).body("User added to database!");
        }



    }
}
