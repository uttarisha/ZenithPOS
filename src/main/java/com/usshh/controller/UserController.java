package com.usshh.controller;

import com.usshh.exceptions.UserException;
import com.usshh.mapper.UserMapper;
import com.usshh.model.User;
import com.usshh.payload.dto.UserDTO;
import com.usshh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

        private final UserService userService;

        @GetMapping("/profile")
        public ResponseEntity<UserDTO> getUserProfile(
                @RequestHeader("Authorization") String jwt
        ) throws UserException {
            User user=userService.getUserFromJwtToken(jwt);
            return ResponseEntity.ok(UserMapper.toDTO(user));
        }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id
    ) throws UserException, Exception {
        User user=userService.getUserById(id);
        return ResponseEntity.ok(UserMapper.toDTO(user));
    }

    }


