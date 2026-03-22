package com.happypour.happypour.service;

import com.happypour.happypour.dto.LoginRequest;
import com.happypour.happypour.dto.RegisterRequest;
import com.happypour.happypour.dto.UserDetailsDTO;
import com.happypour.happypour.entity.User;
import com.happypour.happypour.mapper.UserMapper;
import com.happypour.happypour.repository.UserRepository;
import com.happypour.happypour.security.JWTUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
    /*@Autowired
    MailService mailService;*/
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

    public UserDetailsDTO getDtoByUsername(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isPresent()) {
            return UserMapper.toDTO(optionalUser.get());

        } else {
            return null;
        }
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

    public UserDetailsDTO processLogin(LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String rawPassword = loginRequest.getPassword();

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if(optionalUser.isPresent()) {
            User user = optionalUser.get();
            if(user.isVerified() == false) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "User account with email "+user.getEmail()+"  is not verified.");
            }

            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return UserMapper.toDTO(user);
            
            } else {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Invalid credentials provided.");
            }

        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, 
                "Invalid credentials provided.");
        }
    }

    /** Creates a new user from received RegisterRequest and saves it into the repository.
     * If a verified user with the given email already exists, throws a CONFLICT ResponseStatusException.
     * On the other hand, if an unverified user with given email already exists, deletes it and creates a new one.
     *
     * @param request
     * @return true, if user was successfully created in the database.
     */
    public void registerUser(RegisterRequest request) {
        if((request.getEmail() == null || request.getUsername() == null || request.getPassword() == null)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Email, username, and password are required."
            );
        }

        Optional<User> optionalEmail = userRepository.findByEmail(request.getEmail());
        if(optionalEmail.isPresent()) {      
            if(optionalEmail.get().isVerified()) {
                throw new ResponseStatusException(
                    HttpStatus.CONFLICT, 
                    "User with given email already exists."
                ); 
            } else {
                // If an unverified user with given email exists, delete it.
                userRepository.delete(optionalEmail.get());
            }
        }

        Optional<User> optionalUsername = userRepository.findByUsername(request.getUsername());
        if(optionalUsername.isPresent()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, 
                "User with given username already exists."
            );
        }
        User user = UserMapper.toEntity(request, true); // Set to true until email verification is implemented.
        createUser(user);

        // String token = jwtUtil.generateToken(registerRequest.getEmail(), 15);
        // mailService.sendRegisterLink(token, registerRequest.getEmail(), registerRequest.getUsername());  
    }

    /**
     * Saves User to repository with an encrypted password.
     * @param user entity to be saved
     */
    public void createUser(User user) {
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);
        try {
            userRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
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

    public User getById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
