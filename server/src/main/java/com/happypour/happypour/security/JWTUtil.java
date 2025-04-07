package com.happypour.happypour.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * <h4>JWTUTIL implements the singleton pattern.</h4>
 * Its constructor is private and can be only accessed through the getInstance -method.
 * <br><br>
 * Don't try to use or un-private the instructor!
 * getInstance will return an existing instance or will create one, if it doesn't exist.
 */
@Component
public class JWTUtil {

    @Value("${jwt.secret}")
    private String secretKey;  // Spring will inject the value here

    // No need for singleton pattern, Spring will manage the bean
    // Remove the getInstance() method as Spring manages the instance

    // Generate JWT token
    public String generateToken(String username) {
        System.out.println("Secret: " + secretKey);  // This will print the secretKey when it is properly injected
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 60 * 600 * 30))
                .signWith(getKey())
                .compact();
    }

    // Validate JWT token
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token);
            return true;

        } catch (Exception e) {
            return false;
        }
    }

    // Get local secretKey in SecretKey form
    private SecretKey getKey() {
        if (secretKey == null || secretKey.trim().isEmpty()) {
            throw new IllegalStateException("JWT Secret key is null or empty");
        }
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);  // Decode the base64 encoded secret
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Extract username from JWT Token
    public String extractUsername(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject();  // Get the username (subject) from the claims
    }

    // Extract all claims from the JWT token
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}