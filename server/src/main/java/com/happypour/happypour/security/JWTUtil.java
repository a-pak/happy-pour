package com.happypour.happypour.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JWTUtil {
    private static final String secretKey = generateKey();
    private static JWTUtil instance = null;
    
    // Singleton constructor
    private JWTUtil() {
        System.out.println("\n\nSecret key: " + secretKey + "\n\n");
    }

    public static JWTUtil getInstance() {
        if(instance == null) {
            instance = new JWTUtil();
        }

        return instance;     
    }

    // Generate a key with HmacSHA256 algorithm and return as string
    private static String generateKey() {
        SecretKey sk = null;
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance("HmacSHA256");
            sk = keyGenerator.generateKey();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }

        return Base64.getEncoder().encodeToString(sk.getEncoded());
    }

    // Get local secretkey in SecretKey form
    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate JWT token
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 60 * 60 * 30))
                .and()
                .signWith(getKey())
                .compact();
    }

    public boolean validateToken(String token, String username) {
        try {
            Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token);
            return true;

        } catch (Exception e) {
            return false;
        }
    }

    // Method to extract the username (subject) from the JWT Token
    public String extractUsername(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject(); // Get the username (subject) from the claims
    }

    // Method to extract all claims from the JWT token (used internally)
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getKey()) // <--- RUNS INTO io.jsonwebtoken.UnsupportedJwtException
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // TODO: !!!!!!
    private Date extractExpiration(String token) {
        return null;
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}