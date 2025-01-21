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

/**
 * <h4>JWTUTIL implements the singleton pattern.</h4>
 * Its constructor is private and can be only accessed through the getInstance -method.
 * <br><br>
 * Don't try to use or un-private the instructor!
 * getInstance will return an existing instance or will create one, if it doesn't exist.
 */
@Component
public class JWTUtil {
    private static final String secretKey = generateKey();
    private static JWTUtil instance = null;

    // Private Singleton no args constructor
    private JWTUtil() {}

    /** Method returns the only instance of JWTUtil.
     *
     * @return Instance of JWTUTIL
     */
    public static JWTUtil getInstance() {
        if(instance == null) {
            instance = new JWTUtil();
        }

        return instance;     
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

    // Generate a key with HmacSHA256 algorithm and return as string
    private static String generateKey() {
        SecretKey sk;
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance("HmacSHA256");
            sk = keyGenerator.generateKey();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }

        return Base64.getEncoder().encodeToString(sk.getEncoded());
    }

    // Get local secretKey in SecretKey form
    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Method to extract the username (subject) from the JWT Token
    public String extractUsername(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject(); // Get the username (subject) from the claims
    }

    /** Method to extract all claims from the JWT token (private, used internally)
     *
     *  @Note: If included method Jwts.verifyWith(key) is called after an HTTP request, the request will be denied with status 500(Internal server error).
     *  Even if there is no JWT security filter configured.
     *
     * @param token JWT token as String
     * @return claims from the token as io.jsonwebtoken.Claims.
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // TODO: Extract expiration from a token, to see if it is still valid.
    private boolean isTokenExpired(String token) {
        return false;
    }
}