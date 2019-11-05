package com.SUT.classroom.Controller;

import com.SUT.classroom.Repository.*;
import com.SUT.classroom.Entity.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParseException;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.stream.Collectors;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.*;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;
import java.time.*;

//@CrossOrigin(origins = "http://localhost:4200")
//@CrossOrigin(origins = {"https://sutclassroomproject.firebaseapp.com" , "http://localhost:4200"} )
@CrossOrigin
@RestController
public class TeacherController {
    @Autowired
    private final ScoreRepository scoreRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private TeacherRepository teacherRepository;

    public TeacherController(StudentRepository studentRepository, ScoreRepository scoreRepository, TeacherRepository teacherRepository
            ) {
        this.studentRepository = studentRepository;
        this.scoreRepository = scoreRepository;
        this.teacherRepository = teacherRepository;
    }

    @GetMapping("/Teacher")
    public Collection<Teacher> Teacher() {
        return teacherRepository.findAll().stream().collect(Collectors.toList());
    }

    @PostMapping("/newTeacher/{tCode}/{tUsername}/{tPassword}/{tEmail}")
    public Teacher newTeacher(@PathVariable String tCode,@PathVariable String tUsername,@PathVariable String tPassword,@PathVariable String tEmail) {
        Teacher teacherid = new Teacher();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd:MM:yyyy");
        
        teacherid.setTCode(tCode);
		teacherid.setTUsername(tUsername);
		teacherid.setTPassword(tPassword);
		teacherid.setTEmail(tEmail);
        
        return teacherRepository.save(teacherid);
    }

    @GetMapping("/Login/{tUsername}/{tPassword}")
    public Collection<Teacher> Login(@PathVariable String tUsername,@PathVariable String tPassword) {
        return teacherRepository.findAll().stream().filter(s -> s.getTUsername().equals(tUsername) && s.getTPassword().equals(tPassword)).collect(Collectors.toList());
    }

    @GetMapping("/Check")
    public String Check() {
        return "Online";
    }
}
