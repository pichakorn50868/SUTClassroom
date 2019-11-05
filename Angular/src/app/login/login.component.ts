import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Login } from './login';
import { ClassroomService } from '../classroom.service';
import { AlertService } from '../alert.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  teachers:any;
  online : boolean;
  offline : boolean;
  suspect : boolean;
  database : string;
  interval:any;
  constructor(private fb: FormBuilder, private router: Router,private classroomService: ClassroomService,private alertService: AlertService) { 
    this.interval = setInterval(() => {
      this.check();
    },900000)
   
  }

  ngOnInit() {
    this.form = this.fb.group({     // {5}
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.offline = false;
    this.online=false;
    this.suspect = true;
    this.database = "suspect";

    this.classroomService.getTeacher().subscribe(data =>{
      this.suspect = false;
      this.offline = false;
      this.online = true;
      this.database = "online";
    },
    error =>{
      this.suspect = false;
      this.online=false;
      this.offline = true;
      this.database = "offline";

    }
    );
  }

  onSubmit(){
    if (this.form.valid) {
              this.login(this.form.value);
    }
  }

  check(){
    this.classroomService.getTeacher().subscribe(data =>{
      this.suspect = false;
      this.offline = false;
      this.online = true;
      this.database = "online";
      
      console.log("Database online");
    },
    error =>{
      this.suspect = false;
      this.online=false;
      this.offline = true;
      this.database = "offline";
      
      console.log("Database offline");
    }
    );
  }

  login(login: Login){
    this.classroomService.getLogin(login.userName,login.password).subscribe(
      data =>{
        
      if(data == "" || data==null)
        this.alertService.error('Username หรือ Password ไม่ถูกต้อง');
      this.teachers = data;
      
      localStorage.setItem('currentUser',this.teachers[0].tusername);
      localStorage.setItem('tCode',this.teachers[0].tcode);

      location.replace('/dashboard');

    },
      error => {
        console.log('Error', error);
        this.alertService.error('Username หรือ Password ไม่ถูกต้อง');
    }


      );
  }
  register(){
    this.router.navigate(['/register']);
  }

}
