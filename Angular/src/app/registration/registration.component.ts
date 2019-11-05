import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Registration } from './registration';
import { ClassroomService } from '../classroom.service';
import { AlertService } from '../alert.service';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {HttpClient} from '@angular/common/http';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  form: FormGroup;
  teachers:any;
  clicked:any;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  teacher : any = {
    tcode : '',
    username : '',
    password : '',
    email : '',
  };

  matcher = new MyErrorStateMatcher();

  constructor(private httpClient: HttpClient,private fb: FormBuilder, private router: Router,private classroomService: ClassroomService,private alertService: AlertService) { }

  ngOnInit() {
    this.form = this.fb.group({     // {5}
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

/*
  login(login: Registration){
    this.classroomService.getLogin(login.userName,login.password).subscribe(
      data =>{
      this.teachers = data;
      localStorage.setItem('currentUser',this.teachers[0].tcode);

      location.replace('/dashboard');
    },
      error => {
        console.log('Error', error);
        this.alertService.error('Username หรือ Password ไม่ถูกต้อง');
    }


      );
  }
  */

  login(){
    this.router.navigate(['/login']);
  }
  register(tcode,username,password,email){
    //localhost:8080/newTeacher/B5917426/Graph/1234/graphemail
    this.httpClient.post('https://sutclass.herokuapp.com/newTeacher/'+tcode+'/'+username+'/'+password+'/'+email,this.teacher)
                        .subscribe(
                            data => {
                                console.log('PUT Request is successful', data);
                                localStorage.setItem("currentUser",username);
                                localStorage.setItem("tCode",tcode);
                                location.replace('/dashboard');
                            },
                            error => {
                                console.log('Error', error);
                                this.alertService.error('Error Username มีผู้ใช้งานแล้ว');
                            }
    );

  }

}
