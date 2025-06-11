package com.happypour.happypour.service;

import com.happypour.happypour.dto.RegisterRequest;
import com.happypour.happypour.model.User;
import com.happypour.happypour.repository.UserRepository;
import com.happypour.happypour.security.JWTUtil;
import jakarta.mail.MessagingException;
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
        Optional<User> optionalUser = userRepository.findByUsername(username);
        return optionalUser.orElse(null);
    }

    public User getByEmail(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        return optionalUser.orElse(null);
    }

    public boolean userExistsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
    public boolean userExistsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
    public boolean userIsVerifiedByEmail(String email) {
        if(userRepository.findByEmail(email).isPresent()) {
            return userRepository.findByEmail(email).get().isVerified();
        }
        return false;
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
            if(!user.isVerified()) {
                throw new RuntimeException
                        ("User account with email "+ user.getEmail() +"  is not verified.");
            }
            return passwordEncoder.matches(rawPassword, user.getPassword());

        }
        System.err.println("User not present!");
        return false;
    }

    /** Makes a new user based on RegisterRequest and saves it into the repository.
     *
     * @param registerRequest
     * @return true, if user was successfully created in the database.
     */
    public boolean registerUser(RegisterRequest registerRequest) {
        User user = User.builder()
                .id(null)
                .email(registerRequest.getEmail())
                .username(registerRequest.getUsername())
                .password(registerRequest.getPassword())
                .verified(false)
                .build();
        Optional<User> optionalUser = userRepository.findByEmail(user.getEmail());
        if(optionalUser.isPresent()) {
            userRepository.delete(optionalUser.get());
        }
        boolean registerSuccess = createUser(user);

        if(registerSuccess) {
            // TODO: Un-comment to enable smtp links to send.
            /*
                String token = jwtUtil.generateToken(registerRequest.getEmail(), 15);
                mailService.sendRegisterLink(token, registerRequest.getEmail(), registerRequest.getUsername());

             */
            return true;
        } else {
            return false;
        }
    }

    /**
     * Saves User to repository with an encrypted password.
     * @param user
     * @return true, if user was saved successfully.
     */
    public boolean createUser(User user) {
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);
        try {
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
        boolean tokenValid = jwtUtil.validateToken(token);
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
