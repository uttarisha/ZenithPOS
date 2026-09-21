package com.usshh.service;

import com.usshh.exceptions.UserException;
import com.usshh.payload.dto.UserDTO;
import com.usshh.payload.response.AuthResponse;

public interface AuthService {

    AuthResponse signup(UserDTO userDto) throws UserException;
    AuthResponse login(UserDTO userDto) throws UserException;
}
