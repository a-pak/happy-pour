package com.happypour.happypour.security.principal;

public record UserDetailsPrincipal(
        Long id,
        String username,
        String email
) {}
