package com.happypour.happypour;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.happypour.happypour.security.JWTUtil;

@SpringBootTest
public class JWTtest {
    JWTUtil jwtUtil;
    final String username = "testuser";

    @BeforeEach
    void setup() {
        this.jwtUtil = JWTUtil.getInstance();
    
    }

    @Test
    @DisplayName("Extracted name from token should match the original name")
    void extractNameTest() {
        String token = jwtUtil.generateToken(username);
        System.out.println("Token: " + token);
        
        String extractedUsername = jwtUtil.extractUsername(token);
        System.out.println("Extracted username: " + extractedUsername);

        assertEquals(username, extractedUsername);
    }
    @Test
    @DisplayName("Generated token should be valid")
    void validateTokenTest() {
        String token = jwtUtil.generateToken(username);
        System.out.println("Token: " + token);
        
        boolean isValid = jwtUtil.validateToken(token, username);
        System.out.println("Is token valid? " + isValid);

        assertTrue(isValid);
    }

}
