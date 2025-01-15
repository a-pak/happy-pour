package com.happypour.happypour.security;
import com.happypour.happypour.model.User;
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
    private String secretKey; // <--- String variable for secret key?


    // Generate and return a secret key without hard-coded values.
    private SecretKey getKey() {
        // Generate a key with HmacSHA256 algorithm
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance("HmacSHA256");
            SecretKey sk = keyGenerator.generateKey();
            secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }

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

    // Method to validate a JWT token (example: check if the token is correctly signed)
    public boolean validateToken(String token, User user) {
        String userName = extractUsername(token);
        return (userName.equals(user.getUsername()));
    }

    // Method to extract the username (subject) from the JWT Token
    public String extractUsername(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject(); // Get the username (subject) from the claims
    }

    // Method to extract all claims from the JWT token (used internally)
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith( getKey() ) // Set the same secret key used to sign the JWT
                .build()
                .parseSignedClaims(token) // Parse the token and extract claims
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