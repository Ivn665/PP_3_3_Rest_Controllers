package ru.kata.spring.boot_security.demo;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.SpringVersion;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.thymeleaf.extras.springsecurity5.util.SpringSecurityVersionUtils;

import java.io.IOException;
@SpringBootApplication(scanBasePackages="ru.kata.spring.boot_security.demo")
public class SpringBootSecurityDemoApplication {

    public static void main(String[] args) {

		SpringApplication.run(SpringBootSecurityDemoApplication.class, args);

		System.out.println("\nStarted\n");

/*		try {
			openHomePage();
		} catch (IOException e) {
			System.out.println("Не удалось автоматически открыть стартовую страницу в браузере");
		}*/
	}
	private static void openHomePage() throws IOException {
		Runtime rt = Runtime.getRuntime();
		rt.exec("rundll32 url.dll,FileProtocolHandler " + "http://localhost:8080/");
	}

	@Bean
	public PasswordEncoder getPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public ModelMapper getModelMapper() {return new ModelMapper();}
}
