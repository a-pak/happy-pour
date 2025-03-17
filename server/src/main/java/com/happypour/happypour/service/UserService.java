package com.happypour.happypour.service;

import com.happypour.happypour.dto.RegisterRequest;
import com.happypour.happypour.model.User;
import com.happypour.happypour.repository.UserRepository;
import com.happypour.happypour.security.JWTUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;



/**
   NOTE: A JWTutil has been added as an autowired dependency.
 */




@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JWTUtil jwtUtil;
    @Autowired
    MailService mailService;
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

    /**
     * Checks if a user with matching email and password exists in the database.
     * @param email
     * @param rawPassword
     * @return True, if user with email and password exists (And were successfully pulled from database).
     */
    public boolean authenticate(String email, String rawPassword) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if(optionalUser.isPresent()) {
            User user = optionalUser.get();
            if(user.isVerified() == false) {
                throw new RuntimeException
                        ("User account with email "+ user.getEmail() +"  is not verified.");
            }
            return passwordEncoder.matches(rawPassword, user.getPassword());

        }
        return false;
    }

    /** Makes a new user based on RegisterRequest and saves it into the repository.
     *
     * @param registerRequest
     * @return true, if user was successfully created in the database.
     */
    public boolean registerUser(RegisterRequest registerRequest) {
        String cryptedPassword = passwordEncoder.encode(registerRequest.getPassword());
        User user = User.builder()
                .id(null)
                .email(registerRequest.getEmail())
                .username(registerRequest.getUsername())
                .password(cryptedPassword)
                .verified(false)
                .build();
        boolean registerSuccess = createUser(user);

        if(registerSuccess) {
            // String token = jwtUtil.generateToken(registerRequest.getEmail());
            // mailService.sendRegisterLink(token, registerRequest.getEmail());
            return true;
        } else {
            return false;
        }
    }

    public boolean createUser(User user) {
        try {
            user.setVerified(true); // <- DEBUG
            user.setPassword( passwordEncoder.encode(user.getPassword()) ); // <- DEBUG
            userRepository.save(user);
            return true;

        } catch (Exception e) {
            return false;
        }
    }
    public User updateUser(User updatedUser) {

        return userRepository.findByEmail(updatedUser.getEmail())
                .map(existingUser -> {
                    BeanUtils.copyProperties(updatedUser, existingUser, "id");
                    return userRepository.save(existingUser);
                })
                .orElse(null);
    }

    /**
     * <h3>verifyUser</h3>
     * takes in a JWT token, validates it and checks if there is a user with email listed in the database.
     * @param token a user registration JWT
     * @return true if user verification was successful
     */
    public boolean verifyUser(String token) {
        String extractedEmail = jwtUtil.extractUsername(token);
        boolean tokenValid = jwtUtil.validateToken(token, extractedEmail);
        Optional<User> optionalUser = userRepository.findByEmail(extractedEmail);

        if (optionalUser.isPresent() && tokenValid) {
            User user = optionalUser.get();
            user.setVerified(true);
            if (updateUser(user) != null) {
                return true;
            }
        }
        return false;
    }

    public boolean matchUser(String email, String token) {
        return jwtUtil.extractUsername(token).equals(email);
    }
}
