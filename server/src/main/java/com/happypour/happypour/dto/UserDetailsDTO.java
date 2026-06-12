package com.happypour.happypour.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
/**
 * Data Transfer Object for User entity.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsDTO {
    private Long id;
    private String username;
    private String email;
}
