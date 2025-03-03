package com.happypour.happypour.dto;

import com.happypour.happypour.model.User;
import lombok.Builder;
import lombok.Data;

/**
 * A DTO to be sent to user on a successful login
 */
public class UserDTO {
    private String username;
    private String email;
    public UserDTO (User user) {
        this.username = user.getUsername();
        this.email = user.getEmail();
    }
}
