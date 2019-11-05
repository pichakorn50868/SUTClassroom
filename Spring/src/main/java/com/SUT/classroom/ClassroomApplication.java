package com.SUT.classroom;

import com.SUT.classroom.Entity.*;
import com.SUT.classroom.Repository.*;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.filter.CharacterEncodingFilter;
import java.util.*;
import java.util.stream.*;
import java.util.stream.Stream;
import java.text.*;
import java.text.ParseException;
import org.springframework.web.bind.annotation.*;
import java.time.format.DateTimeFormatter;
import java.time.*;

import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
//@CrossOrigin(origins = "https://sutclassroomproject.firebaseapp.com")
@SpringBootApplication
@Configuration
@EnableAutoConfiguration
@ComponentScan
public class ClassroomApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClassroomApplication.class, args);
	}

	@Bean
	CharacterEncodingFilter characterEncodingFilter() {
		CharacterEncodingFilter filter = new CharacterEncodingFilter();
		filter.setEncoding("UTF-8");
		filter.setForceEncoding(true);
		return filter;
	}

	@Bean
	ApplicationRunner init(TeacherRepository teacherRepository,StudentRepository studentRepository, SubjectRepository subjectRepository
							,ScoreRepository scoreRepository) throws Exception {
		return args -> {
			
			System.out.println("Spring Boot Pass");
			String colorwhite = "\u001b[37m";
			String Success = "\u001b[32m";
			System.out.println(Success + "Mvnw Spring-boot:Run ::  Success !!" + colorwhite);
		};
	};
}
