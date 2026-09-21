package com.usshh.controller;

import com.usshh.exceptions.UserException;
import com.usshh.payload.dto.UserDTO;
import com.usshh.payload.response.AuthResponse;
import com.usshh.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

public class AuthController {

    private final AuthService authService;
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signupHandler(
            @RequestBody UserDTO userDto
    ) throws UserException {
        return ResponseEntity.ok(
                authService.signup(userDto)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginHandler(
            @RequestBody UserDTO userDto
    ) throws UserException {
        return ResponseEntity.ok(
                authService.login(userDto)
        );
    }

}
