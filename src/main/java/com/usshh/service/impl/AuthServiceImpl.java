package com.usshh.service.impl;

import com.usshh.configuration.JwtProvider;
import com.usshh.domain.UserRole;
import com.usshh.exceptions.UserException;
import com.usshh.mapper.UserMapper;
import com.usshh.model.User;
import com.usshh.payload.dto.UserDTO;
import com.usshh.payload.response.AuthResponse;
import com.usshh.repository.UserRepository;
import com.usshh.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    // CHANGED (1): roles allowed to self-register. ADMIN and ROLE_STORE_MANAGER are not included.
    private static final Set<UserRole> SIGNUP_ALLOWED_ROLES = Set.of(
            UserRole.ROLE_STORE_ADMIN,
            UserRole.ROLE_BRANCH_MANAGER,
            UserRole.ROLE_BRANCH_CASHIER
    );

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CustomUserImpl customUserImpl;

    @Override
    public AuthResponse signup(UserDTO userDto) throws UserException {
        User user = userRepository.findByEmail(userDto.getEmail());
        if (user != null) {
            throw new UserException("email id already registered !");
        }

        if (userDto.getRole() == null) {
            throw new UserException("role is required");
        }


        if (!SIGNUP_ALLOWED_ROLES.contains(userDto.getRole())) {
            throw new UserException("this role cannot be used for signup !");
        }

        User newUser = new User();
        newUser.setEmail(userDto.getEmail());
        newUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        newUser.setRole(userDto.getRole());
        newUser.setFullName(userDto.getFullName());
        newUser.setPhone(userDto.getPhone());
        newUser.setLastLogin(LocalDateTime.now());
        // createdAt/updatedAt are set automatically by @PrePersist on User

        User savedUser = userRepository.save(newUser);

        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority(savedUser.getRole().name())
        );

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(userDto.getEmail(), userDto.getPassword(), authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Registered Successfully");
        authResponse.setUser(UserMapper.toDTO(savedUser));

        return authResponse;
    }

    @Override
    public AuthResponse login(UserDTO userDto) throws UserException {
        String email = userDto.getEmail();
        String password = userDto.getPassword();
        Authentication authentication = authenticate(email, password);

        User user = userRepository.findByEmail(email);

        // CHANGED (2): the role chosen on the login page must match the stored role.
        // This runs before the token is created, so a mismatch never gets a JWT.
        if (userDto.getRole() == null || user.getRole() != userDto.getRole()) {
            throw new UserException("invalid credentials for the selected role");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateToken(authentication);

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Login Successfully");
        authResponse.setUser(UserMapper.toDTO(user));

        return authResponse;
    }

    private Authentication authenticate(String email, String password) throws UserException {
        UserDetails userDetails = customUserImpl.loadUserByUsername(email);

        if (userDetails == null) {
            throw new UserException("email id doesn't exist " + email);
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new UserException("password doesn't match");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}