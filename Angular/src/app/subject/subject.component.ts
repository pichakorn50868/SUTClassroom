import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ParamMap, ActivatedRoute, } from '@angular/router';
import { ClassroomService } from '../classroom.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { CdkColumnDef } from '@angular/cdk/table';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import {FormControl} from '@angular/forms';
import { AlertService } from 'app/alert.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { saveAs } from 'file-saver';
import {ExcelService} from '../excel.service';
@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {

  courseParam: any;
  headerParam: any;
  groupParam: any;
  termParam:any;
  n:any;
  subjects:any;
  scores:any;
  column:any;
  typescores:any;
  beforescores:any;
  nowSubjectId:String;
  nowSubject:String;
  nowGroup:String;
  nowTerm:String;
  selecttab:String;
  x:number;
  j:number;
  dataSource = new MatTableDataSource<Scores>(this.scores);
  dataSource2 = new MatTableDataSource<Scores>(this.scores);
  filtername = new MatTableDataSource<Scores>(this.scores);
  tabs:any;
  students:any;
  selected = new FormControl(0);

  displayedColumns: string[] = ['stdcode', 'name'];
  columnsToDisplay: string[] = [];
  displayedColumns2: string[] = ['stdcode', 'name'];
  columnsToDisplay2: string[] = [];
  beforetabs:any;
  qscore:any[];
  scorelimit:any[] = [];
  time:any;
  addtime:any;
  checktable:boolean;
  showSpinner: boolean = true;
  loading:boolean = true;
  columntime:number;
  limit:number;
  percent:any = "";
  updatestdcode:any = "";
  tempcolumn:number =1;
  stdcode:any = "";
  nodata:boolean;
  type:any[];
  qgroup:string[] = ["all"];
  tempgroup:Number;
  selectgroup:any = "all";
  qscorecheck:boolean = false;
  havechangegroup:number = 0;
  tempsubjectcode:any;
  haveupdate:boolean = false;
  first:boolean = true;
  dataexcel: any;
  filename:any;
  noscore:any;
  dbhaveupdate:any;
  typenameList:any[];
  percentList:any[];
  public gg = "gg";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  color = 'warn';
  mode = 'indeterminate';
  value = 50;
  dataexcelarray: any ;
  dataexceltype:any;
  totalscoreList:any[];
  gradeList:any[];
  scoreList:any[];
  limitList:any[];
  realList:any[];
  constructor(private excelService:ExcelService,private httpClient:HttpClient,private activatedRoute: ActivatedRoute,private classroomService : ClassroomService,private router :Router) { 
    this.loading = true;

  }

  
  exportexcel() {

    
    this.dataexcel = [];
    this.totalscoreList = [];
    this.gradeList = [];
    this.scoreList = [];
    this.realList = [];
    this.limitList = [];
    this.classroomService.getQScoreWithgroup(this.courseParam,this.headerParam,'all').subscribe(data =>{
    
      for(let h in data){

        this.typenameList = data[h][0].subject.typeName;
        this.percentList = data[h][0].subject.typeScore;
        this.scoreList.push(data[h][0].totalScore);
        this.totalscoreList.push(data[h][0].totalScore[data[h][0].subject.typeName.length-1]);
        this.gradeList.push(data[h][0].gradeScore);
        this.dataexcel.push({ลำดับ: data[h][0].numStudent, รหัสนักศึกษา: data[h][0].student.stdCode, "ชือ-สกุล" : data[h][0].student.firstName+" "+data[h][0].student.surName, Major: data[h][0].student.stdMajor, กลุ่ม: data[h][0].numGroup});
        this.filename =  data[h][0].subject.subjectCode+" "+data[h][0].subject.subjectName;
        
      }
      this.excelService.exportAsExcelFile(this.filename,this.dataexcel,this.typenameList,this.percentList,this.limitList,this.realList,this.scoreList,this.totalscoreList,this.gradeList);

    });
  }
  

  ngOnInit() {
    this.loading = true;

    this.checktable = true;
    localStorage.setItem("QScore","0");
    
    
    
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.courseParam = params.get('id');
      if(this.havechangegroup == 0)
        this.tempsubjectcode = this.courseParam;
      this.headerParam = String(params.get('header'));
      this.termParam = String(params.get('event'));

      if(this.courseParam != this.tempsubjectcode){
        history.go(0);
      }

      
          this.classroomService.getQSubject(this.courseParam).subscribe(data =>{
            this.subjects = data;

            this.nowSubjectId= this.subjects[0].subjectId;
            this.nowSubject= this.subjects[0].subjectName;
            this.nowGroup= this.subjects[0].subjectGroup;
            this.nowTerm= this.subjects[0].subjectTerm;
            this.dbhaveupdate = this.subjects[0].haveUpdate;

              this.classroomService.getQTypename(this.courseParam).subscribe(data =>{
                this.typescores = data;
                this.tabs = data;
                this.tabs.push('Score');

                this.qScore(); 
                
              });
            
          });    
      
      
    });
    
        
  }

  qScore(){
    this.loading = true;
    this.dataSource.data = null;
    this.beforescores = null; 
    this.dataSource.paginator = null;
    this.dataSource.sort = null;
    this.scores = null;

    this.displayedColumns = ['stdcode', 'name'];
    this.columnsToDisplay = [];
    this.displayedColumns2 = ['stdcode', 'name'];
    this.columnsToDisplay2 = [];
    this.scorelimit = [];
    this.type = []
    this.selecttab = this.headerParam;

    this.qscore = [];
    
    if(this.headerParam == "Score" && this.dbhaveupdate){
          this.loading = true;
          this.classroomService.getScore(this.courseParam).subscribe(data =>{
            this.nodata = false;
            this.qscorefunction();
          }
        );
      
    }
    else if(this.headerParam == "Score" && !this.dbhaveupdate){
      this.nodata = false;
      this.qscorefunction();
    }
    else{
      this.nodata = true;
      this.qscorefunction();
    }


  }
  qscorefunction(){
    this.loading = true;
    this.qscore = [];
    this.displayedColumns = ['stdcode', 'name'];
    this.columnsToDisplay = [];
    this.displayedColumns2 = ['stdcode', 'name'];
    this.columnsToDisplay2 = [];
    this.classroomService.getQScoreWithgroup(this.courseParam,this.headerParam,this.selectgroup).subscribe(data =>{
      console.log("Query");
      this.value++;
      if(this.value == data.length){
        this.value = 100;
      }

        for(let h in data){
          this.qscore.push(data[h][0]);
          
          let calindex = 0;

          if((data[h][0].numGroup != this.tempgroup) && this.selectgroup == "all" && this.havechangegroup == 0){
            this.qgroup.push(data[h][0].numGroup);
            this.tempgroup = data[h][0].numGroup;
          }    
        }
      
          this.havechangegroup = 1;
          this.first = false;


          

      if(data == "" || data == null){
        this.dataSource.data = null;
        this.dataSource2.data = null;
        this.beforescores = null; 
        this.dataSource.paginator = null;
        this.dataSource2.paginator = null;

        this.dataSource.sort = null;
        this.dataSource2.sort = null;

        this.scores = null;
        
        this.checktable = false;

        this.displayedColumns = ['stdcode', 'name','miss'];
        this.columnsToDisplay = [];
        this.displayedColumns2 = ['stdcode', 'name'];
        this.columnsToDisplay2 = [];
        this.time = 1;
      }
    else {
      this.dataSource.data = this.qscore;
      this.dataSource2.data = this.qscore;

      this.beforescores = this.qscore;
      this.dataSource.paginator = this.paginator;
      this.dataSource2.paginator = this.paginator;

      this.dataSource2.sort = this.sort;
      this.dataSource.sort = this.sort;

      
      this.scores = this.qscore;
      
      this.scorelimit.push(this.scores[0].limitScore);
      //console.log(this.scores[0].limitScore);

      this.j = 0;
      if(data == null){
        this.checktable = false;
      }
      else if(this.headerParam == "Score"){
        //alert(this.scores[0].subject.typeName);
        for(let i = 0; i<this.scores[0].subject.typeName.length-1; i++){
          this.j=this.j+1;
          this.type.push(this.scores[0].subject.typeScore[i]);
          this.addColumn2(this.scores[0].subject.typeName[i]);
          console.log(this.scores[0].subject.typeName[i]); 
        }
        /* for(var i in this.scores){
          console.log(this.scores[i].gradeScore);  
        } */
        this.pushTotal();
      }

      else if(this.scores[0].realScore == ""){
        this.time = 1;
        
      }
      else{
       // alert(this.scores[0].realScore );
        for(let i in this.scores[0].realScore){
          this.j=this.j+1;
          this.addColumn("ครั้งที่ "+this.j);
          console.log("ครั้งที่ "+this.j);   
        }

        this.time = this.j+1;
      }
      this.pushGradeMiss();
      this.showSpinner = false;
      
    }
    this.loading = false;
    
   
  }
  
  );
  }
  qScorenonre(){
    this.qscore = [];
    let count = 0;
    this.classroomService.getQScoreWithgroup(this.courseParam,this.headerParam,this.selectgroup).subscribe(data =>{
      //let maxpercent = data[0].length;
      //this.percent = 1;
      
      for(let h in data){
        count++;
        let maxpercent = data[h][0].subject.stdno;
        this.percent = (100*count)/maxpercent;
        this.qscore.push(data[h][0]);
      }
     
      this.dataSource.data = this.qscore;
      this.beforescores = this.qscore;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      this.scores = this.qscore;
    
      this.percent = "Done";
      this.stdcode = "";

      setTimeout( () => { this.percent = "" }, 2000 );

  
  }
  );

  }
  
  addTime(addtime){
    this.loading = true;

    this.displayedColumns = ['stdcode', 'name'];

    ///sutclass.herokuapp.com/AddTime/202292_3-61/Attendence/10/10/10
    this.httpClient.post('https://sutclass.herokuapp.com/AddTime/'+this.courseParam+'/'+this.headerParam+'/'+this.time+'/'+addtime,this.qscore).subscribe(
                  data => {
                      console.log('Addtime Request is successful', data);
                      //this.alertService.success('เพิ่ม '+this.courseParam+' ครั้งที่ '+this.time+" เรียบร้อย");
                      this.haveupdate = true;
                      this.qScore();

                    },
                  error => {
                      console.log('Error', error);
                     // this.alertService.error("Error เพิ่มครั้งที่ "+this.time+"ไม่ได้");
                  }
              );
    this.pushGradeMiss();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  //  this.filtername.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  pushGradeMiss(){
    this.displayedColumns.push('miss');
    console.log("Push miss");

  }
  pushTotal(){
    this.displayedColumns2.push('total');
    this.displayedColumns2.push('grade');
    console.log("Push 2");

  }

  addColumn(score) {
    this.displayedColumns.push(score);
    this.columnsToDisplay.push(score);
  }
  addColumn2(score) {
    this.displayedColumns2.push(score);
    this.columnsToDisplay2.push(score);
  }

  addTab(selectAfterAdding: boolean) {
    this.tabs.push('New');

    if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1);
      
    }

  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }

  selectTab(index) {
    this.loading = true;
    this.dataSource.data = null;
    this.beforescores = null; 
    this.dataSource.paginator = null;  

    this.dataSource.sort = null;   

    this.scores = null;

    this.time = 0;
    this.selecttab = this.tabs[index].typeName;

    this.qScore();
  }

  updatetime(column){
    this.columntime = column+1;
    //alert(this.columntime);
   // this.limit = limit+1;
    //alert(column+1);
    //var retVal = prompt("Enter your name : ", "your name here");

    //document.write("You have entered : " + retVal);
  }
  updaterow(columntime,score){
    // https://sutclass.herokuapp.com/UpdateScore/202292_3-61/HW/B5917471/1/5
    this.percent = "";

    //alert(this.dataSource.data[0].scoreId);
    this.tempcolumn = +columntime+1;
    //alert(this.courseParam+'/'+this.headerParam+'/'+this.updatestdcode+'/'+this.tempcolumn+'/'+score);
    if(score > this.scorelimit[0][this.tempcolumn-1]){
      this.percent = "คะแนนเกิน";
    }
    else{
      this.percent = "Processing";
      this.httpClient.post('https://sutclass.herokuapp.com/UpdateScore/'+this.courseParam+'/'+this.headerParam+'/'+this.updatestdcode+'/'+this.tempcolumn+'/'+score,this.qscore).subscribe(
                    data => {
                        console.log('UpdateScore Request is successful', data[0]);
                        //this.alertService.success('เพิ่ม '+this.courseParam+' ครั้งที่ '+this.time+" เรียบร้อย");
                        this.haveupdate = true;
                        this.qScorenonre();
                        //this.router.navigateByUrl('/'+this.router.url, {skipLocationChange: true}).then(()=>
                        //this.router.navigate(['/'+this.router.url]));

                      
                      },
                    error => {
                        console.log('Error', error);
                        
                        this.percent = "Error รหัสนักศึกษา";
                      // this.alertService.error("Error เพิ่มครั้งที่ "+this.time+"ไม่ได้");
                    }
    );
  }
  }
  update(stdcode,score){
    // https://sutclass.herokuapp.com/UpdateScore/202292_3-61/HW/B5917471/1/5

    //alert(this.dataSource.data[0].scoreId);

    if(score > this.scorelimit[0][this.columntime-1]){
      this.percent = "คะแนนเกิน";
    }
    else{
      this.percent = "Processing";
      this.httpClient.post('https://sutclass.herokuapp.com/UpdateScore/'+this.courseParam+'/'+this.headerParam+'/'+stdcode+'/'+this.columntime+'/'+score,this.qscore).subscribe(
                    data => {
                        console.log('UpdateScore Request is successful', data[0]);
                        //this.alertService.success('เพิ่ม '+this.courseParam+' ครั้งที่ '+this.time+" เรียบร้อย");
                        this.haveupdate = true;
                        this.qScorenonre();
                        //this.router.navigateByUrl('/'+this.router.url, {skipLocationChange: true}).then(()=>
                        //this.router.navigate(['/'+this.router.url]));

                      
                      },
                    error => {
                        console.log('Error', error);
                        
                        this.percent = "Error รหัสนักศึกษา";
                      // this.alertService.error("Error เพิ่มครั้งที่ "+this.time+"ไม่ได้");
                    }
    );
  }
  }
  updateall(score){

    if(score > this.scorelimit[0][this.columntime-1]){
      this.percent = "คะแนนเกิน";
    }
    else{
      this.percent = "Processing";
      this.httpClient.post('https://sutclass.herokuapp.com/UpdateAll/'+this.courseParam+'/'+this.headerParam+'/'+this.columntime+'/'+score+'/'+this.selectgroup,this.qscore).subscribe(
                    data => {
                        console.log('UpdateAll Request is successful');
                        this.haveupdate = true;

                        this.qScorenonre();
                      },
                    error => {
                        console.log('Error', error);
                        
                        this.percent = "Error รหัสนักศึกษา";
                      // this.alertService.error("Error เพิ่มครั้งที่ "+this.time+"ไม่ได้");
                    }
    );
  }
  }
  show(test){
    //alert("SHOW "+test.student.stdCode);
    this.updatestdcode = test.student.stdCode;
  }
  showcolumn(column){
    this.tempcolumn = +column+1;
    //alert(this.tempcolumn);
  }

  downloadFile(data: any) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs(blob, "myFile.csv");
}
}

export interface Scores {
  scoreId: number;
name: string;
position: number;
weight: number;
symbol: string;
}

