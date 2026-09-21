package com.usshh;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PosSystemApplication {

	public static void main(String[] args) {
		// Load .env variables into System properties before Spring initializes
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing() // Prevents app crash if .env doesn't exist in production
				.load();

		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);

		SpringApplication.run(PosSystemApplication.class, args);
	}

}