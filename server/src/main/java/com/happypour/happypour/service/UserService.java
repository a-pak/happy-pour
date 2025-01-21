package com.happypour.happypour.service;

import com.happypour.happypour.dto.RegisterRequest;
import com.happypour.happypour.model.User;
import com.happypour.happypour.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService (){
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User getByUsername(String username) {
        Optional<User> optionalUser = this.userRepository.findByUsername(username);
        return optionalUser.orElse(null);
    }

    public User getByEmail(String email) {
        Optional<User> optionalUser = this.userRepository.findByEmail(email);
        return optionalUser.orElse(null);
    }

    public boolean userExistsByEmail(String email) {
        return this.userRepository.findByEmail(email).isPresent();
    }
    public boolean userExistsByUsername(String username) {
        return this.userRepository.findByUsername(username).isPresent();
    }

    // Authenticates user with email and password
    public boolean authenticate(String email, String rawPassword) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if(optionalUser.isPresent()) {
            User user = optionalUser.get();
            return passwordEncoder.matches(rawPassword, user.getPassword());

        }
        return false;
    }

    // Makes a new user based on RegisterRequest and saves it into the repository.
    public Boolean registerUser(RegisterRequest registerRequest) {
        String cryptedPassword = passwordEncoder.encode(registerRequest.getPassword());
        User user = User.builder()
                .id(null)
                .email(registerRequest.getEmail())
                .username(registerRequest.getUsername())
                .password(cryptedPassword)
                .build();

        try {
            userRepository.save(user);
            return true;

        } catch (Exception e) {
            return false;
        }

    }
}
