package com.happypour.happypour.dto;

import com.happypour.happypour.model.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

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
