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
public class StudentController {
    @Autowired
    private final StudentRepository studentRepository;
    @Autowired
    private ScoreRepository scoreRepository;

    public StudentController(StudentRepository studentRepository, ScoreRepository scoreRepository
            ) {
        this.studentRepository = studentRepository;
        this.scoreRepository = scoreRepository;
    }

    @GetMapping("/Student")
    public Collection<Student> Student() {
        return studentRepository.findAll().stream().collect(Collectors.toList());
    }

    @PostMapping("/addStudent/{stdCode}/{name}/{stdMajor}")
    public Student addStudent(@PathVariable String stdCode,@PathVariable String name,@PathVariable String stdMajor) {
        Student sid = new Student();

        String [] fullname = new String[2];
        fullname = name.split(" ");
            sid.setStdCode(stdCode);
            sid.setFirstName(fullname[0]);
            sid.setSurName(fullname[1]);
            sid.setStdMajor(stdMajor);
     
        return studentRepository.save(sid);
    }
}
