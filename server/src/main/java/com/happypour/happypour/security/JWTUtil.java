package com.happypour.happypour.security;

import com.happypour.happypour.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JWTUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    

    public String generateRefreshToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 120))
                .signWith(getKey())
                .compact();
    }
    public String generateAccessToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15))
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