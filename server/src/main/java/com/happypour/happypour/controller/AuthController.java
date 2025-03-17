package com.happypour.happypour.controller;

import com.happypour.happypour.dto.LoginRequest;
import com.happypour.happypour.dto.RegisterRequest;
import com.happypour.happypour.model.User;
import com.happypour.happypour.security.JWTUtil;
import com.happypour.happypour.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins={"http://localhost:3000", "http://localhost:5173"})
public class AuthController {
    private final UserService userService;
    private final JWTUtil jwtUtil;
    @Autowired
    public AuthController(UserService us, JWTUtil jt){
        this.userService = us;
        this.jwtUtil = jt;
    }
    // TODO: Return user details on successful login.
    @PostMapping("/login")
    public ResponseEntity<String> login (@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        try {
            if (userService.authenticate(email, password)) {
                User user = userService.getByEmail(email);

                Cookie tokenCookie = new Cookie("token", jwtUtil.generateToken(user.getUsername()));
                tokenCookie.setHttpOnly(true);
                tokenCookie.setSecure(false);    // This ensures the cookie is sent only over HTTPS
                tokenCookie.setPath("/");       // This cookie will be sent for all requests to the domain
                tokenCookie.setMaxAge(60 * 60 * 24); // (e.g., 1 hour)
                response.addCookie(tokenCookie);
                response.setHeader("SameSite","None");

                Cookie emailCookie = new Cookie("email", user.getEmail());
                emailCookie.setPath("/");
                emailCookie.setSecure(false);
                // emailCookie.setMaxAge(60* 60);
                response.addCookie(emailCookie);

                Cookie usernameCookie = new Cookie("username", user.getUsername());
                usernameCookie.setPath("/");
                usernameCookie.setSecure(false);
                // usernameCookie.setMaxAge(60 * 60);
                response.addCookie(usernameCookie);

                return ResponseEntity.ok("Logged in Successfully!");
            } else {
                return ResponseEntity.status(401).body("Invalid credentials.");
            }
        } catch (Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());

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

    @PostMapping("/verify/{token}")
    public ResponseEntity<String> verifyAccount(@PathVariable String token) {
        try {
            if(userService.verifyUser(token)) {
                return ResponseEntity.ok("User verified successfully!");
            } else {
                return ResponseEntity.badRequest().body("Request with token invalid!");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred while verifying user!\n" + e.getMessage());
        }
    }
}
