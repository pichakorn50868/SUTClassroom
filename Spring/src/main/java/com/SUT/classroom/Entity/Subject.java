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

@NoArgsConstructor
@Data
@Entity
@Table(name="Subject") //ชื่อตาราง
public class Subject {
    @Id  //  Annotations  @Id  บอกว่าเป็น  Primary  key
    @Column(name="SUBJECTCODE_ID",unique = true)
    @NotNull(message="subjectcodeid_seq must not be null to be valid")
    @SequenceGenerator(name="subjectcodeid_seq",sequenceName="subjectcodeid_seq")
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="subjectcodeid_seq")   
    private Long subjectCodeId;

    @Column(name="subjectCode",unique = true)
    private String subjectCode;
    private Integer subjectId;
    private String subjectName;
    private String subjectTerm;
    
    private String modeGrade;
    private Integer[] rangeGrade;
    
    private String[] typeName;
    private Integer[] typeScore;

    @NotNull(message="teacher must not be null to be valid")
    @ManyToOne(fetch = FetchType.EAGER, targetEntity = Teacher.class)
    @JoinColumn(name= "TEACHER_ID", insertable = true)
    private Teacher teacher;

    
    private LocalDate dateStudent;
    private LocalDate dateScore;
    private Integer stdno;
    private Boolean haveUpdate;
}