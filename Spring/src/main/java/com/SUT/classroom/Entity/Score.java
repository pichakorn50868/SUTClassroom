package com.SUT.classroom.Entity;

import lombok.Data;
import lombok.NonNull;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.util.Date;
import java.time.format.DateTimeFormatter;
import java.time.*;
import java.util.*;
import lombok.*;

import javax.validation.constraints.Pattern;

@NoArgsConstructor
@Data
@Entity
@Table(name="Score") //ชื่อตาราง
public class Score {
    @Id  //  Annotations  @Id  บอกว่าเป็น  Primary  key
    @Column(name="SCORE_ID",unique = true) 
    @SequenceGenerator(name="score_seq",sequenceName="score_seq")
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="score_seq")   // Annotations Generate id เอง ตอน insert
    private Long scoreId;

    private ArrayList<Integer> limitScore;
    private ArrayList<Double> realScore;
    private ArrayList<Integer> missScore;
    private ArrayList<Double> totalScore;
    
    private String gradeScore;

    @NotNull(message="subject must not be null to be valid")
    @ManyToOne(fetch = FetchType.EAGER, targetEntity = Subject.class)
    @JoinColumn(name= "subject", insertable = true)
    private Subject subject;

    private String scoreType; 

    @NotNull(message="student must not be null to be valid")
    @ManyToOne(fetch = FetchType.EAGER, targetEntity = Student.class)
    @JoinColumn(name= "STUDENT_ID", insertable = true)
    private Student student;

    private Integer numStudent;
    private Integer numGroup;
}