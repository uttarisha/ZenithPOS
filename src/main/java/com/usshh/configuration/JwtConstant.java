package com.usshh.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtConstant {

    @Value("${jwt.secret}")
    private String jwtSecret;

    public static final String JWT_HEADER = "Authorization";

    public String getJwtSecret() {
        return jwtSecret;
    }
}