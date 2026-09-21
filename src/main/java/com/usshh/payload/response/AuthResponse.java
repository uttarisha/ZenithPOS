package com.usshh.payload.response;


import com.usshh.payload.dto.UserDTO;
import lombok.Data;

@Data
public class AuthResponse {

    private String jwt;
    private String message;
    private UserDTO user;

}
