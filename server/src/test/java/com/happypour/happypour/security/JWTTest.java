package com.happypour.happypour.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public class JWTTest {
    final String username = "testuser";

    @Autowired
    private JWTUtil jwtUtil;

    @Test
    @DisplayName("Extracted name from token should match the original name")
    public void extractNameTest() {

        String token = jwtUtil.generateToken(username, 2);
        System.out.println("Token: " + token);
        
        String extractedUsername = jwtUtil.extractUsername(token);
        System.out.println("Extracted username: " + extractedUsername);

        assertEquals(username, extractedUsername);
    }
    @Test
    @DisplayName("Generated token should be valid")
    public void validateTokenTest() {

        String token = jwtUtil.generateToken(username, 2);
        System.out.println("Token: " + token);
        
        boolean isValid = jwtUtil.validateToken(token);
        System.out.println("Is token valid? " + isValid);

        assertTrue(isValid);
    }

}
