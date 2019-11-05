import { Component, OnInit,Inject,HostListener } from '@angular/core';
import {ClassroomService} from '.././classroom.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { IfStmt } from '@angular/compiler';
import {HttpClient} from '@angular/common/http';
import {AlertService} from '../alert.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {formatDate} from '@angular/common';

export interface DialogData {
  animal: string;
  name: string;
}
export interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  states: string[] = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  animal: string;
  students:string[];
  studentmajor:string[];
  name: string;
  subjects:any;
  rangedaf:any;
  rangedsf:any;
  a:any;
  bplus:any;
  b:any;
  c:any;
  cplus:any;
  d:any;
  dplus:any;
  f:any;
  fs:any;
  s:any;
  af :string[];
  test:string[];
  studentgroup:number[];
  subject:any;
  sum:number;
  grade: any = {
    a: '',
    bplus: '',
    b: '',
    cplus:'',
    c: '',
    dplus: '',
    d: '',
    s: '',
    f: 0,
    fs: 0,
  };

  type: any ={
    name:  '',
    score: ''
  }
  rangegrade = [];
  typename = [];
  typescore = [];
  eventList = [];
  addCourseForm: FormGroup;
  buttonDisabled:boolean;
  insertStudentForm: FormGroup; // เพิ่มนักศึกษา กรอกข้อมูล
  csv: any;
  teachers:any;
  sjname: '';
  sjcode: '';
  selected = 'A-F';
  numstudent = 0;
  havecsv : boolean;
  modegradeselected: any;
  count : number;
  timeLeft: number = 0;
  interval;
  major:any;
  csvupload:boolean = false;
  process:number =0;
  studentname:any;
  csvex:any;
  constructor(
    private fb: FormBuilder,private classroomService : ClassroomService,public dialog: MatDialog,private httpClient:HttpClient,private alertService:AlertService,private router:Router) {

    this.modegradeselected = "A-F";
    this.rangedaf = "A-F";
    this.a = this.s = 100;
    //this.b = this.bplus = this.cplus = this.c = this.dplus =this.d = this.f =0;
    this.eventList = [
   //   { id: 'attendance', name: "Attendance",score: "10", fn: true, isClick: true, isSelected: true },
    ];
    
    this.type.name = "Attendence";
    this.buttonDisabled = false;
    this.havecsv = false;
   // formatDate(new Date(), 'yyyy/MM/dd', 'th');
   }

   openDialog(): void {
    const dialogRef = this.dialog.open(Dialog, {
      width: '300px',
      height: '300px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  ngOnInit() {
    this.classroomService.QSubjectbyteacher(localStorage.getItem('tCode')).subscribe(data =>{
      this.subjects = data;
      console.log("QSubjectbyteacher : "+JSON.stringify(data));
    });

    this.insertStudentForm = this.fb.group({
      id: new FormControl(null, [
        Validators.required,
        Validators.pattern("[B|M|D]\\d{7}")
      ]),
      name: new FormControl(null, [
        Validators.required
      ]),
      group: new FormControl(null, [
        Validators.required
      ])
    });

      this.addCourseForm = this.fb.group({
        id: new FormControl(null, [
          Validators.required,
          Validators.pattern("^[1-9]\\d{5}$")
        ]),
        name: new FormControl(null, [
          Validators.required,
        ]),
        year: new FormControl(null, [
          Validators.required
        ]),
        trimester: new FormControl(null, [
          Validators.required
        ]),
        eventInput: new FormControl(null, [
          Validators.required
        ]),
        eventScore: new FormControl(null, [
          Validators.required
        ]),
      }); 

  }
  displayedColumns =
  ['name', 'position', 'weight', 'symbol', 'position', 'weight', 'symbol', 'star'];
  dataSource = ELEMENT_DATA;

  plus(){
    

  }
  OnChange(value,grade){
    if(this.rangedsf == "S-F" ){
      if(this.grade.s >= 100 ){
        this.grade.s = '';
        this.havecsv = false;
        this.alertService.error("Error S ต้องน้อยกว่า "+100);
      }
      else if(this.grade.s <= 0){
        this.grade.s = '';
        this.fs =  '';
        this.havecsv = false;
        this.alertService.error("Error S ต้องมากกว่า "+0);
      }
      else if(grade == "s"){
        this.fs = value-1;
      }
    }
    else if(this.rangedaf == "A-F"){
      if(grade == "a"){
        if(this.grade.a >= 100){
          this.grade.a = '';
          this.grade.bplus = this.bplus =  '';          
          this.grade.b = this.b =  '';
          this.grade.cplus = this.cplus =  '';          
          this.grade.c = this.c =  '';
          this.grade.dplus = this.dplus =  '';
          this.grade.d = this.d =  '';
          this.grade.f = this.f =  '';
          this.havecsv = false;
          this.alertService.error("Error A ต้องน้อยกว่า "+100);
        }
        else if(this.grade.a <= 0){
          this.grade.a = '';
          this.bplus =  '';
          this.havecsv = false;
          this.alertService.error("Error A ต้องมากกว่า "+0);
        }
        else
          this.bplus = value-1;
      }
      else if(grade == "bplus"){
        if(this.grade.bplus >= this.grade.a-1 || this.grade.b >= value-1){
          let temp = this.grade.a-1;
          this.grade.bplus = '';          
          this.grade.b = this.b =  '';
          this.grade.cplus = this.cplus =  '';          
          this.grade.c = this.c =  '';
          this.grade.dplus = this.dplus =  '';
          this.grade.d = this.d =  '';
          this.grade.f = this.f =  '';
          this.havecsv = false;
          this.alertService.error("Error B+ ");
        }
        else if(this.grade.bplus <= 0){
          this.grade.bplus = '';
          this.b =  '';
          this.havecsv = false;
          this.alertService.error("Error B+ ต้องมากกว่า "+0);
        }
        else
          this.b = value-1;
      }
      else if(grade == "b"){
        if(this.grade.b >= this.grade.bplus-1 || this.grade.cplus >= value-1){  
          let temp = this.grade.bplus-1 ;        
          this.grade.b = '';
          this.grade.cplus = this.cplus =  '';          
          this.grade.c = this.c =  '';
          this.grade.dplus = this.dplus =  '';
          this.grade.d = this.d =  '';
          this.grade.f = this.f =  '';
          this.havecsv = false;
          this.alertService.error("Error B ");
        }
        else if(this.grade.b <= 0){
          this.grade.b = '';
          this.cplus =  '';
          this.havecsv = false;
          this.alertService.error("Error B ต้องมากกว่า "+0);
        }
        else
          this.cplus = value-1;
      }
      else if(grade == "cplus"){
        if(this.grade.cplus >= this.grade.b-1 || this.grade.c >= value-1){
          let temp = this.grade.b-1;
          this.grade.cplus = '';          
          this.grade.c = this.c =  '';
          this.grade.dplus = this.dplus =  '';
          this.grade.d = this.d =  '';
          this.grade.f = this.f =  '';
          this.havecsv = false;
          this.alertService.error("Error C+ ");
        }
        else if(this.grade.cplus <= 0){
          this.grade.cplus = '';
          this.c =  '';
          this.havecsv = false;
          this.alertService.error("Error C+ ต้องมากกว่า "+0);
        }
        else
          this.c = value-1;
      }
      else if(grade == "c"){
        if(this.grade.c >= this.grade.cplus-1 || this.grade.dplus >= value-1){    
          let temp = this.grade.cplus-1;      
          this.grade.c = '';
          this.grade.dplus = this.dplus =  '';
          this.grade.d = this.d =  '';
          this.grade.f = this.f =  '';
          this.havecsv = false;
          this.alertService.error("Error C ");
        }
        else if(this.grade.c <= 0){
          this.grade.c = '';
          this.dplus =  '';
          this.havecsv = false;
          this.alertService.error("Error C ต้องมากกว่า "+0);
        }
        else
          this.dplus = value-1;
      }
      else if(grade == "dplus"){
        if(this.grade.dplus >= this.grade.c-1 || this.grade.d >= value-1){
          let temp = this.grade.c-1;
          this.grade.dplus = '';
          this.grade.d = this.d =  '';
          this.grade.f = this.f =  '';
          this.havecsv = false;
          this.alertService.error("Error D+ ");
        }
        else if(this.grade.dplus <= 0){
          this.grade.dplus = '';
          this.d =  '';
          this.havecsv = false;
          this.alertService.error("Error D+ ต้องมากกว่า "+0);
        }
        else
          this.d = value-1;
      }
      else if(grade == "d"){
        if(this.grade.d >= this.grade.dplus-1 || this.grade.f >= value-1){
          let temp =this.grade.dplus-1;
          this.grade.d = '';
          this.grade.f = this.f =  '';
          this.havecsv = false;
          this.alertService.error("Error D ");
        }
        else if(this.grade.d <= 0){
          this.grade.d = '';
          this.f =  '';
          this.havecsv = false;

          this.alertService.error("Error D ต้องมากกว่า "+0);
        }
        else
          this.f = value-1;
      }
      else{
        this.bplus = value-1;
      }
    }

    if(this.modegradeselected == "A-F" && this.grade.a != "" && this.grade.bplus != "" && this.grade.b != "" && this.grade.cplus != "" && this.grade.c != "" && this.grade.dplus != "" && this.grade.d != "" && this.sum == 100 && this.csv != null){
      this.havecsv = true;
    }  
    else if(this.modegradeselected == "S-F" && this.grade.s != "" && this.sum == 100 && this.csv != null){
      this.havecsv = true;
    }
    else if(this.modegradeselected == "A-F" && this.grade.a != "" && this.grade.bplus != "" && this.grade.b != "" && this.grade.cplus != "" && this.grade.c != "" && this.grade.dplus != "" && this.grade.d != "" && this.sum != 100){
      this.alertService.error("กรุณา เพิ่มรายการเก็บคะแนน ให้ครบ 100%");
      this.havecsv = false;
      if(this.csv == null){
        this.alertService.error("กรุณา Upload CSV");
        this.havecsv = false;
      } 
    }else if(this.modegradeselected == "S-F" && this.grade.s != "" && this.sum != 100){
      this.alertService.error("กรุณา เพิ่มรายการเก็บคะแนน ให้ครบ 100%");
      this.havecsv = false;
      if(this.csv == null){
        this.alertService.error("กรุณา Upload CSV");
        this.havecsv = false;
      } 
    }
    else if(this.csv == null){
      this.alertService.error("กรุณา Upload CSV");
      this.havecsv = false;
      if(this.sum != 100){
        this.alertService.error("กรุณา เพิ่มรายการเก็บคะแนน ให้ครบ 100%");
        this.havecsv = false;
      }
    } 

    
  }

  handleSelectChange(event) {
    if(event == "A-F"){
      this.rangedsf = null;
      this.rangedaf = event;
    }
    else if(event == "S-F"){
      this.rangedaf = null;
      this.rangedsf = event;
    }
}
addsubject(subjectyear,subjectterm,modegrade){
      if(this.modegradeselected == "A-F" ){
                  
        this.rangegrade = [];
        
          this.rangegrade.push(this.grade.a);
          this.rangegrade.push(this.grade.bplus); 
          this.rangegrade.push(this.grade.b);
          this.rangegrade.push(this.grade.cplus);
          this.rangegrade.push(this.grade.c);
          this.rangegrade.push(this.grade.dplus);
          this.rangegrade.push(this.grade.d);
          this.rangegrade.push(this.grade.f);

      }
      else if(this.modegradeselected == "S-F"){
        this.rangegrade = [];
        
        this.rangegrade.push(this.grade.s);
        this.rangegrade.push(this.grade.f); 
      }

      if(modegrade == "A-F"){
          //newSubject/test/COMPUTER%20ENGINEERING%20PROJECT%20I/523495/1-58/S-F/80,0/Attendence/91
          //@PostMapping(value="/newSubject/{tcode}/{sjname}/{sjid}/{sjterm}/{modegrade}/{rangegrade}/{typename}/{typescore}")
          this.httpClient.post('https://sutclass.herokuapp.com/newSubject/'+localStorage.getItem("tCode")+'/'+this.sjname+'/'+this.sjcode+'/'+subjectterm+"-"+subjectyear+'/'+modegrade+'/'+this.rangegrade.toString()+'/'+this.typename.toString()+'/'+this.typescore.toString()+'/'+this.students.length,this.subject)
          .subscribe(
              data => {
                  console.log('PUT Request is successful', data);
                  this.newScore(subjectterm,subjectyear);
                },
              error => {
                  console.log('Error', error);
                  this.alertService.error("Error มีรายวิชาเทอมนี้ปีนี้แล้ว");
              }
          );
      }
      else if(modegrade == "S-F"){
          //newSubject/test/COMPUTER%20ENGINEERING%20PROJECT%20I/523495/1-58/S-F/80,0/Attendence/91
          //@PostMapping(value="/newSubject/{tcode}/{sjname}/{sjid}/{sjterm}/{modegrade}/{rangegrade}/{typename}/{typescore}")
          this.httpClient.post('https://sutclass.herokuapp.com/newSubject/'+localStorage.getItem("tCode")+'/'+this.sjname+'/'+this.sjcode+'/'+subjectterm+"-"+subjectyear+'/'+modegrade+'/'+this.rangegrade.toString()+'/'+this.typename.toString()+'/'+this.typescore.toString()+'/'+this.students.length,this.subject)
          .subscribe(
              data => {
                  console.log('PUT Request is successful', data);
                  this.newScore(subjectterm,subjectyear); 
                },
              error => {
                  console.log('Error', error);
                  this.alertService.error("Error มีรายวิชาเทอมนี้ปีนี้แล้ว");
              }
          );
      }
  
}
newScore(subjectterm,subjectyear){
      let count = 0;
      
      this.alertService.waitsuccess('กำลังทำการเพิ่มรายวิชา '+this.sjname+" : "+this.sjcode,0.045*this.students.length);
      for(let i = 0;i<this.students.length; i++ ){
        for(let j = 0; j<this.typename.length; j++){
                var keep = i+1;
                //https://sutclass.herokuapp.com/newScore/202292_1-58/B5917426/numstudent/numgroup/Attendence
                this.httpClient.post('https://sutclass.herokuapp.com/newScore/'+this.sjcode+"_"+subjectterm+"-"+subjectyear+'/'+this.students[i]+'/'+keep+'/'+this.studentgroup[i]+'/'+this.typename[j],this.subject)
                .subscribe(
                    data => {
                        console.log('PUT newScore Request is successful', data);
                        if(i == this.students.length-1 && j == this.typename.length-1){
                          this.alertService.success('เพิ่มรายวิชา '+this.sjname+" : "+this.sjcode+" เรียบร้อย");
                          setTimeout(() => { history.go(0); }, 2000);
                        }
                      },
                    error => {
                        console.log('Error', error);
                    }
                );
        }
      }
}

// course.compoentn.ts 450 อัพโหลด csv
onUploadcsv() {
  const student = this.insertStudentForm.value;
  var csvArray = this.csv.split(/\r?\n/);
  var csvArray2d = new Array();
  var regex = new RegExp("^[ก-๙a-zA-Z-.]+\\s[ก-๙a-zA-Z-.]+[\\s]*[-ก-๙a-zA-Z-.]+");

  this.students = [];
  this.studentgroup = [];
  this.studentmajor = [];
  this.studentname = [];

  this.csvex = csvArray.length-2;
  let temp = [];
  for (var i = 1; i < csvArray.length - 1; i++) {
    csvArray2d[i] = csvArray[i].split(",");
    
    if(student.id == null && !regex.test(csvArray2d[i][2])){
      console.log("Upload Failed : Please upload UTF-8 Format")
      this.alertService.error('Please upload UTF-8 Format Upload Failed')
      break;
    }
    else if (regex.test(csvArray2d[i][2])) {
      
        student.id = csvArray2d[i][1];
        student.name = csvArray2d[i][2];
        student.group = csvArray2d[i][4];
        
        this.students.push(student.id);
        this.studentgroup.push(student.group);
        //this.studentname.push(student.name);
        if(csvArray2d[i][3] == "N/A")
          this.major = "ยังไม่มีสาขา";
        else
          this.major = csvArray2d[i][3];

        this.studentmajor.push(this.major);

        if(i == 1){
          this.alertService.waitsuccess('Please wait for a while Upload Successfully About '+0.07*(csvArray.length-2)+" Second",0.05*(csvArray.length-2));
          this.count = 1;

          this.timeLeft = 0;
          this.process = 0;

          this.interval = setInterval(() => {
            this.timeLeft++;
          },1000)
        }
       // sutclass.herokuapp.com/addStudent/B591445/ZZ HH/CPE
       this.httpClient.post('https://sutclass.herokuapp.com/addStudent/'+student.id+'/'+student.name+'/'+this.major,this.students)
          .subscribe(
              data => {
                  console.log('PUT addStudent Request is successful '+this.count,this.timeLeft);

                  this.process = this.count*100/(csvArray2d.length-1);
                  if ( csvArray2d.length-1 == this.count){
                    this.process = 100;
                    this.sjcode = csvArray2d[1][7];
                    this.sjname = csvArray2d[1][8];

                    clearInterval(this.interval);
                    this.numstudent = csvArray2d.length-1;

                    this.alertService.success('เพิ่มนักศึกษาจำนวน '+this.numstudent+"คน เรียบร้อย ใช้เวลา"+this.timeLeft+" วิ");
                    console.log("addStudent is successful");
                    this.csvupload = true;

                    if(this.modegradeselected == "A-F" ){
                      if(this.grade.a != "" && this.grade.bplus != "" && this.grade.b != "" && this.grade.cplus != "" && this.grade.c != "" && this.grade.dplus != "" && this.grade.d != ""){
                        this.havecsv = true;

                      }
                      else{
                        this.alertService.error("กรุณา กรอกช่วงคะแนนให้ครบ");
                        this.havecsv = false;
                      }
                  
                      if(this.sum != 100){
                        this.alertService.error("กรุณา เพิ่มรายการเก็บคะแนน ให้ครบ 100%");
                        this.havecsv = false;
                      }
                      else if(this.rangegrade.length == 8 && this.sum == 100){
                  
                        this.havecsv = true;
                      }
                      
                    }
                    else if(this.modegradeselected == "S-F" ){
                        if(this.grade.s != ""){
                          this.havecsv = true;

                        }
                        else{
                          this.alertService.error("กรุณา กรอกช่วงคะแนนให้ครบ");
                          this.havecsv = false;
                        }
                  
                        if(this.sum != 100){
                        this.alertService.error("กรุณา เพิ่มรายการเก็บคะแนน ให้ครบ 100%");
                        this.havecsv = false;
                        }
                        else if(this.rangegrade.length == 2 && this.sum == 100){
                  
                          this.havecsv = true;
                        }
                    }
              //     setTimeout(() => { history.go(0); }, 1000);
              
                  }
                  this.count++;
                },
              error => {
                this.alertService.error("Error รหัส "+student.id+' ชื่อ '+student.name+' สาขา '+this.major);
                if ( csvArray2d.length-1 == this.count){
                  clearInterval(this.interval);
                  console.log('Error '+this.count+' ใช้เวลา '+this.timeLeft+" วิ");
                  this.alertService.error("Error");
                }
                this.count++;
              }
          );
      
        //console.log("Upload Successfully")
    } 
    else if(!regex.test(csvArray2d[i][2])){
      console.log("Error รหัส "+student.id+' ชื่อ '+student.name+' สาขา '+this.major);
    }
  }

  
  console.log(this.students);
}

  onFileSelect(files: FileList) {
  if (files && files.length > 0) {
    let file: File = files.item(0);
    let reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      this.csv = reader.result;
      this.onUploadcsv();
    }
  }
}
setGroupNo(arr) {
  let maxGroup = Math.max(...arr)
/*
  this.afDb.object(`users/${this.authUid}/course/${this.courseParam}`).update({
    groupNo: maxGroup,
  });
*/
  if (maxGroup != 1) {
    for (var i = 1; i <= maxGroup; i++) {
      let groupName = i;
      /*
      this.afDb.object(`users/${this.authUid}/course/${this.courseParam}/group/${groupName}`).update({
        id: groupName,
        name: 'Group ' + i,
      });
      */
    }
  }
}


 public onClickUserInsertEvent() {
    this.typename = [];
    this.typescore = [];
    if(this.typename[0] == null){
      this.sum = 0;
    }
    if(this.eventList){

    //  this.sum = Number(this.eventList[0].score);
    }
    
    let eventInput = String(this.addCourseForm.value.eventInput);
    let eventScore = this.addCourseForm.value.eventScore;
    /*
    if (/\s/.test(eventInput)) {
      // It has any kind of whitespace
      this.alertService.error('ไม่อนุญาตให้มีช่องว่างในชื่อรายการ')
      return false;
    }
    */
   if(this.addCourseForm.value.eventScore == 0 || String(this.addCourseForm.value.eventInput) == ""){ 
      this.alertService.error('กรุณากรอก รายการเก็บคะแนน และ %');
      return this.sum;
   }
    
    let id = eventInput.toLowerCase();
    
    this.eventList.push(
      { id: id, name: eventInput,score: eventScore, fn: false, isClick: false, isSelected: true },
    )
    this.buttonDisabled = false;

    for(let i in this.eventList){
        this.sum = this.sum+Number(this.eventList[i].score);
        if(this.sum > 100){
          this.alertService.error("% รวม เกิน 100");
          this.sum = this.sum-Number(this.eventList[i].score);
          this.eventList.pop();
        }
        else{
          this.typename.push(this.eventList[i].name);
          this.typescore.push(this.eventList[i].score);
        }
    }
    this.typename.push("Score");

    this.type.name = '';
    this.type.score = '';
    console.log(this.typename.toString());
    console.log(this.typescore.toString());

    if(this.sum == 100 && this.modegradeselected == "A-F" && this.grade.bplus != "" && this.grade.b != "" && this.grade.cplus != "" && this.grade.c != "" && this.grade.dplus != "" && this.grade.d != ""){
      if(this.csv != null)
        this.havecsv = true;
      else if(this.csv == null)
        this.alertService.error("กรุณา Upload CSV");
    }
    else if(this.sum == 100 && this.modegradeselected == "S-F" && this.grade.s != ""){
      if(this.csv != null)
        this.havecsv = true;
      else if(this.csv == null)
        this.alertService.error("กรุณา Upload CSV");
    }
    else if(this.sum != 100)
      null;
    else{
      if(this.csv == null)
        this.alertService.error("กรุณา Upload CSV");
      this.alertService.error("กรุณา กรอกช่วงคะแนนให้ครบ");
    }
  }


delete(subjectcode){
  // localhost:8080/deleteSubject/null_null
  
    this.alertService.waitsuccess('ทำการลบรายวิชา '+subjectcode,this.csvex*0.01);
    let count =1;
    this.httpClient.delete('https://sutclass.herokuapp.com/deleteScore/'+subjectcode,this.subject)
    .subscribe(
        data => {
            console.log('DeleteScore Request is successful', data);
            
              this.httpClient.delete('https://sutclass.herokuapp.com/deleteSubject/'+subjectcode,this.subject)
              .subscribe(
                  data => {
                      console.log('DeleteSubject Request is successful', data);
                      this.alertService.success('ลบรายวิชา '+subjectcode+" เรียบร้อย");
                      
                      history.go(0);
                    },
                  error => {
                      console.log('Error', error);
                      this.alertService.error("Error ลบรายวิชา"+subjectcode+"ไม่ได้");
                  }
              );
            
          },
        error => {
                  this.alertService.error("Error Delete Score"+error);
                    
        }
    );
    
}

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
}

@Component({
  selector: 'dialog',
  templateUrl: 'dialog.html',
})
export class Dialog {

  constructor(
    public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface PeriodicElement {
name: string;
position: number;
weight: number;
symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
{position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
{position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
{position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
{position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
{position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
{position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
{position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
{position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
{position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
{position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];