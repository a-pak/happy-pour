package com.happypour.happypour.security.filter;

import com.happypour.happypour.model.User;
import com.happypour.happypour.security.JWTUtil;
import com.happypour.happypour.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.catalina.core.ApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    private final UserService userService;
    @Autowired
    public JwtFilter(UserService us, JWTUtil ju) {
        this.userService = us;
        this.jwtUtil = ju;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            username = jwtUtil.extractUsername(token);
        }
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {


            // TODO: replace with userDetails
            User user = this.userService.getByUsername(username);




            if (jwtUtil.validateToken(token, user)) {
                /*
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken()

                 */
            }
        }
    }
}
