package com.happypour.happypour.security;

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

    /**
     * Generates a JWT for username.
     * Refresh token is used to renew both access and refresh tokens.
     * @param username user email
     * @param minutes token life cycle length in minutes.
     * @return
     */
    public String generateToken(String username, int minutes) {

        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 60000 * minutes)) // 48 hours?
                .signWith(getKey())
                .compact();
    }
    /**
     * Checks validity of token
     * @param token in string form
     * @return True, if token is valid.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token);
            return true;

        } catch (Exception e) {
            return false;
        }
    }

    private SecretKey getKey() {
        if (secretKey == null || secretKey.trim().isEmpty()) {
            throw new IllegalStateException("JWT Secret key is null or empty");
        }
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);  // Decode the base64 encoded secret
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     *  Extract username from JWT Token
     * @param token jwt in string form
     * @return Extracted username
     */
    public String extractUsername(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject();  // Get the username (subject) from the claims
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}