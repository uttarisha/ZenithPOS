package com.usshh.configuration;

import com.usshh.domain.UserRole;
import com.usshh.model.User;
import com.usshh.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {

        // Only one admin ever: if one exists, do nothing.
        if (userRepository.existsByRole(UserRole.ROLE_ADMIN)) {
            return;
        }

        // Email column is unique, so don't crash startup if it's already taken.
        if (userRepository.findByEmail(adminEmail) != null) {
            log.warn("Admin not created: {} is already registered with a different role. "
                    + "Use another ADMIN_EMAIL or delete that user.", adminEmail);
            return;
        }

        User admin = new User();
        admin.setFullName("System Admin");
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(UserRole.ROLE_ADMIN);
        userRepository.save(admin);

        log.info("Admin account created for {}", adminEmail);
    }
}