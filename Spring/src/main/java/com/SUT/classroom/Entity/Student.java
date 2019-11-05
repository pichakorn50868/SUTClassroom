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
@Table(name="Student") //ชื่อตาราง
public class Student {
    @Id  //  Annotations  @Id  บอกว่าเป็น  Primary  key
    @NotNull(message="stdCode must not be null to be valid")   
    @Column(name="STDCODE_ID",unique = true) 
    private String stdCode;

    private String firstName; 
    private String surName; 
    private String stdMajor;

}