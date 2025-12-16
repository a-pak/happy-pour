package com.happypour.happypour.controller;

import com.happypour.happypour.dto.LoginRequest;
import com.happypour.happypour.dto.RegisterRequest;
import com.happypour.happypour.dto.UserDetailsDTO;
import com.happypour.happypour.model.User;
import com.happypour.happypour.security.JWTUtil;
import com.happypour.happypour.service.UserService;

import jakarta.servlet.http.HttpServletResponse;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${debug.mode:false}")
    private boolean debugMode;

    @Value("${happypour.app.address}")
    private String HAPPYPOUR_APP_ADDRESS;
    private final UserService userService;
    private final JWTUtil jwtUtil;

    public AuthController(UserService us, JWTUtil jt){
        this.userService = us;
        this.jwtUtil = jt;
    }

    /**
     * User login endpoint. 
     * Validates given credentials and applies JWT cookies (access and refresh) if successful.
     * @param loginRequest
     * @param response
     * @return
     */
    @PostMapping("/login")
    public ResponseEntity<UserDetailsDTO> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        System.out.println("\n ---------------------------" + loginRequest.getEmail()+ ", " + loginRequest.getPassword());

        try {
            if (userService.authenticate(email, password)) {
                User user = userService.getByEmail(email);
                System.out.println("USER AUTHENTICATEd!!!!" + user);
                response = applyRefreshCookie(response, user);
                response = applyAccessCookie(response, user);
                System.out.println("APPLIED COOKIES!");
                UserDetailsDTO userDto = new UserDetailsDTO(user);
                System.out.println(userDto);
                return ResponseEntity.ok(userDto);

            } else {
                return ResponseEntity.status(401).build();
            }
        } catch (Exception e) {
            System.out.println("BAD REQUEST: " + e.toString());
                return ResponseEntity.badRequest().build();
        }
    }

    /**
     * User registration endpoint.
     * Validates given user details, checks for overlapping users and registers a new user if valid.
     * @param registerRequest
     * @return
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        String email = registerRequest.getEmail();
        String username = registerRequest.getUsername();
        String password = registerRequest.getPassword();

        if (userService.userExistsByEmail(email) && userService.userIsVerifiedByEmail(email)) {
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

    /**
     * (EMAIL) Endpoint hit when user clicks the link in a verification email.
     * Redirects to the frontend with a message indicating success or failure.
     */
    @GetMapping("/verify/{token}")
    public RedirectView verifyEmail(@PathVariable String token) {
        try {
            if(userService.verifyUser(token)) {
                return new RedirectView(HAPPYPOUR_APP_ADDRESS + "/login?message=register-success");
            } else {
                return new RedirectView(HAPPYPOUR_APP_ADDRESS + "/login?message=register-fail");
            }
        } catch (Exception e) {
            return new RedirectView(HAPPYPOUR_APP_ADDRESS + "/error");
        }
    }

    /**
     * Refreshes the access token for a valid refresh token.
     * Checks if given refresh token is valid and not expired, then applies new access and refresh tokens as cookies.
     * @param refreshToken
     * @param response
     * @return 401 if the refresh token is invalid or missing, 200 with success message otherwise
     */
    @PostMapping("/refresh")
    public ResponseEntity<String> refreshToken(@CookieValue(value = "ref-token", defaultValue = "") String refreshToken, HttpServletResponse response) {
        System.out.println("\nREFRESH!");
        // Validate refresh token structure and expiration
        if(refreshToken.isEmpty() || !jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body("Unauthorized");
        
        }
        // Extract username and check if user exists in the database
        String username = jwtUtil.extractUsername(refreshToken);
        User user = userService.getByUsername(username);
        
        if(username == null || user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        
        }
        response = applyAccessCookie(response, user);
        response = applyRefreshCookie(response, user);
        return ResponseEntity.ok()
                .body("Token refreshed successfully!");
    }
    
    // Helper methods to apply cookies
    private HttpServletResponse applyRefreshCookie(HttpServletResponse response, User user) {
        ResponseCookie cookie = ResponseCookie.from("ref-token", jwtUtil.generateToken(user.getUsername(), 48 * 60))
        .httpOnly(true)
        .path("/")
        .sameSite("None") // debugMode ? "Lax" : "None"
        .maxAge(Duration.ofHours(48))
        .secure(true)
        .build();
        response.addHeader("Set-Cookie", cookie.toString());

        return response;
    }

    private HttpServletResponse applyAccessCookie(HttpServletResponse response, User user) {
        ResponseCookie cookie = ResponseCookie.from("token", jwtUtil.generateToken(user.getUsername(), 15))
        .httpOnly(true)
        .path("/")
        .sameSite("None") // debugMode ? "Lax" : "None"
        .maxAge(Duration.ofMinutes(15))
        .secure(true)
        .build();
        response.addHeader("Set-Cookie", cookie.toString());

        return response;
    }

}
