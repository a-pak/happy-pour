package com.happypour.happypour.mapper;

import com.happypour.happypour.dto.RegisterRequest;
import com.happypour.happypour.dto.UserDetailsDTO;
import com.happypour.happypour.entity.User;

public class UserMapper {
    
    public static User toEntity(
        RegisterRequest request, 
        boolean verified
    ) {
        return User.builder()
            .id(null)
            .email(request.getEmail())
            .username(request.getUsername())
            .password(request.getPassword())
            .verified(verified)
            .build();
    }

    public static UserDetailsDTO toDTO(User user) {
        return new UserDetailsDTO(
            user.getId(),
            user.getUsername(),
            user.getEmail()
        );
    }
}
