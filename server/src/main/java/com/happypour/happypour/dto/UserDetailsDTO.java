package com.happypour.happypour.dto;

import com.happypour.happypour.model.User;
import lombok.Getter;
import lombok.Setter;
/**
 * Data Transfer Object for User entity.
 */
@Setter
@Getter
public class UserDetailsDTO {
    private Long id;
    private String username;
    private String email;

    public UserDetailsDTO(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.username = user.getUsername();
    }
}
