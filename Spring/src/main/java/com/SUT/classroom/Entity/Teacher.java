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
@Table(name="Teacher") //ชื่อตาราง
public class Teacher {
    @Id  //  Annotations  @Id  บอกว่าเป็น  Primary  key
    @SequenceGenerator(name="t_seq",sequenceName="t_seq")
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="t_seq")   // Annotations Generate id เอง ตอน insert
    @Column(name="T_ID",unique = true, nullable = false)
    private Long tId;

    @Column(name="tCode",unique = true)
    private String tCode;

    @Column(name="tUsername",unique = true)
    private String tUsername;
    private String tPassword;

    @Column(name="tEmail",unique = true)
    private String tEmail;

}