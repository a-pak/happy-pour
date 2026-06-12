package com.happypour.happypour.security.filter;

import com.happypour.happypour.mapper.UserMapper;
import com.happypour.happypour.security.JWTUtil;
import com.happypour.happypour.security.principal.UserDetailsPrincipal;
import com.happypour.happypour.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
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
    @Autowired
    private UserService userService;
    
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) 
    throws ServletException, IOException {
        
        // Skip token validation for login and GET api/bars requests
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
                var user = userService.getByUsername(username);

                if(user == null) {
                    return;
                }
                System.out.println("Creating principal for user " + user.getUsername() + "...");
                UserDetailsPrincipal principal = UserMapper.toPrincipal(user);

                UsernamePasswordAuthenticationToken authenticationToken
                        = new UsernamePasswordAuthenticationToken(principal, null, null);
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
                    return jwtToken;
                }
            }
        }
        System.err.println("\nRequest's cookies are NULL!\n");
        return null;
    }
}
