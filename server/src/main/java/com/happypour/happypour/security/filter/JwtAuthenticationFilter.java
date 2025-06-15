package com.happypour.happypour.security.filter;

import com.happypour.happypour.security.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JWTUtil jwtUtil;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Skip token validation for login and GET api/bars requests
        System.out.println("Request URI: " + request.getRequestURI() + " " + request.getMethod());
        System.out.println("Get bars? " + (request.getRequestURI().contains("/api/bars") && "GET".equalsIgnoreCase(request.getMethod())));
        if (request.getRequestURI().contains("/api/auth/") ||
                request.getRequestURI().equals("/") ||
                (request.getRequestURI().contains("/api/bars") && "GET".equalsIgnoreCase(request.getMethod()))) {
            System.out.println("Request URI should not authenticate (Condition met).");
            filterChain.doFilter(request, response);
            return;
        }

        String token = getJwtFromRequest(request);
        String username = null;

        if (token != null) {
            username = jwtUtil.extractUsername(token);
        }
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(token)) {
                UsernamePasswordAuthenticationToken authenticationToken
                        = new UsernamePasswordAuthenticationToken(username, null, null);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request, response);
    }
    private String getJwtFromRequest(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    String jwtToken = cookie.getValue();
                    System.out.println(jwtToken);
                    return jwtToken;
                }
                System.out.println(cookie.getName() +": "+ cookie.getValue() );
            }
        }
        System.err.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Request's cookies are NULL!");
        return null;
    }
}
