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
import java.util.stream.Stream;
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
public class SubjectController {
    @Autowired
    private final ScoreRepository scoreRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private TeacherRepository teacherRepository;

    public SubjectController(StudentRepository studentRepository, ScoreRepository scoreRepository,SubjectRepository subjectRepository,TeacherRepository teacherRepository
                                   
    ) {
        this.studentRepository = studentRepository;
        this.scoreRepository = scoreRepository;
        this.subjectRepository = subjectRepository;
        this.teacherRepository = teacherRepository;
    }

    @GetMapping("/Subject")
    public Collection<Subject> Subject() {
        return subjectRepository.findAll().stream().collect(Collectors.toList());
    }

    @GetMapping("/QTypename/{subjectCode}")
    public ArrayList<String> QTypename(@PathVariable String subjectCode,Subject subject) {
        
        ArrayList<String> sj = new ArrayList<String>();

        Stream.of(subjectRepository.findBySubjectCode(subjectCode).getTypeName()).forEach(typename -> {   
                if(!typename.equals("Score")){
                    sj.add(typename);
                }
        });
        
        return sj;
    }

    @GetMapping("/QSubject/{subjectCode}")
    public Collection<Subject> QSubject(@PathVariable String subjectCode,Subject subject) {
        
        return subjectRepository.findAll().stream().filter(s -> s.getSubjectCode().equals(subjectCode)).collect(Collectors.toList());
    }

    @GetMapping("/QSubjectbyteacher/{tcode}")
    public Collection<Subject> QSubjectbyteacher(@PathVariable String tcode,Subject subject) {
        
        return subjectRepository.findAll().stream().filter(s -> s.getTeacher().getTCode().equals(tcode)).collect(Collectors.toList());
    }

    //localhost:8080/newSubject/B5917xx1/netflix/523444/3-65/S-F/80,0/Attendence,Final term/80,20
    //@PostMapping(value="/newSubject/{tcode}/{sjname}/{sjid}/{sjterm}/{modegrade}/{rangegrade}")
        @PostMapping("/newSubject/{tcode}/{sjname}/{sjid}/{sjterm}/{modegrade}/{rangegrade}/{typename}/{typescore}/{stdno}")
        public Subject newSubject(@PathVariable String tcode,@PathVariable Integer sjid,@PathVariable String sjterm,@PathVariable String modegrade,@PathVariable Integer[] rangegrade,@PathVariable String sjname,@PathVariable String[] typename,@PathVariable Integer[] typescore,@PathVariable Integer stdno) {
    //public Subject newSubject(@PathVariable String tcode,@PathVariable Integer sjid,@PathVariable String sjterm,@PathVariable String modegrade,@PathVariable Integer[] rangegrade,@PathVariable String sjname) {
        Subject sj = new Subject();
                sj.setSubjectId(sjid);
                sj.setSubjectName(sjname);
				sj.setSubjectTerm(sjterm);
				sj.setModeGrade(modegrade);
                sj.setRangeGrade(rangegrade);

                sj.setTypeName(typename);
                sj.setTypeScore(typescore);

                LocalDate currentdate = LocalDate.now();
                sj.setDateScore(currentdate);
                sj.setDateStudent(currentdate);

                sj.setStdno(stdno);

                sj.setSubjectCode(sj.getSubjectId()+"_"+sj.getSubjectTerm());
                sj.setTeacher(teacherRepository.findByTCode(tcode));
                sj.setHaveUpdate(true);

        return subjectRepository.save(sj);
    }

    @DeleteMapping("/deleteSubject/{subjectcode}")
    public Map<String, Boolean> deleteSubject(@PathVariable String subjectcode){
        Subject deleteid = subjectRepository.findBySubjectCode(subjectcode);
        subjectRepository.delete(deleteid);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

}
