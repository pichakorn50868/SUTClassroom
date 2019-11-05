import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClassroomService {

  public DBtest = '//localhost:8080';
  public DBonline = '//sutclass.herokuapp.com';

  constructor(private http: HttpClient) { }

  DB = this.DBonline;

  getScore(subjectCode): Observable<any> {
    return this.http.get(this.DB+'/QTotalScore/'+subjectCode);
  }
  getCheck(): Observable<any> {
    return this.http.get(this.DB+'/Check');
  }
  getTeacher(): Observable<any> {
    return this.http.get(this.DB+'/Teacher');
  }

  getSubject(): Observable<any> {
    return this.http.get(this.DB+'/Subject');
  }
  getQSubject(subjectCode): Observable<any> {
    return this.http.get(this.DB+'/QSubject/'+subjectCode);
  }
  QSubjectbyteacher(tcode): Observable<any> {
    return this.http.get(this.DB+'/QSubjectbyteacher/'+tcode);
  }
  getLogin(username,password): Observable<any> {
    return this.http.get(this.DB+'/Login/'+username+'/'+password);
  }
  getQStudentregis(tCode): Observable<any> {
    return this.http.get(this.DB+'/QStudentregis/'+tCode);
  }
  getQStudent(subjectCode): Observable<any> {
    return this.http.get(this.DB+'/QStudent/'+subjectCode);
  }
  getQScore(subjectCode,typeScore): Observable<any> {
    return this.http.get(this.DB+'/QScore/'+subjectCode+'/'+typeScore);
  }
  
  getQScoreWithgroup(subjectCode,typeScore,group): Observable<any>{
    return this.http.get(this.DB+'/QScoreWithgroup/'+subjectCode+'/'+typeScore+'/'+group);

  }
  getQTypename(subjectCode): Observable<any> {
    return this.http.get(this.DB+'/QTypename/'+subjectCode);
  }
  
}

