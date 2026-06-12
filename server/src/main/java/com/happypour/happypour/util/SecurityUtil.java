package com.happypour.happypour.util;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import com.happypour.happypour.security.principal.UserDetailsPrincipal;

@Component
public class SecurityUtil {
    public UserDetailsPrincipal getCurrentPrincipal() {
        
        Authentication auth = SecurityContextHolder.getContext()
                                .getAuthentication(); 

        if (auth != null && auth.getPrincipal() instanceof UserDetailsPrincipal) {
            return (UserDetailsPrincipal) auth.getPrincipal();
        
        }

        throw new ResponseStatusException(
            HttpStatus.UNAUTHORIZED, 
            "No authenticated user found."
        );
    }
    
    public Long getCurrentUserId() {
        return getCurrentPrincipal().id();
    }

    public void checkUserIdMatchesPrincipal(Long userId) {
        if (!getCurrentUserId().equals(userId)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, 
                "Authenticated user does not match the creator id provided."
            );
        }
    }
}
