package com.SUT.classroom.Repository;

import com.SUT.classroom.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

//@CrossOrigin(origins = "http://localhost:4200")
//@CrossOrigin(origins = {"https://sutclassroomproject.firebaseapp.com" , "http://localhost:4200"} )
@CrossOrigin
@RepositoryRestResource
public interface TeacherRepository extends JpaRepository<Teacher ,Long> {
    Teacher findByTCode(String tCode);
}
