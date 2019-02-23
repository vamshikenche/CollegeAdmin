import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpParams, HttpInterceptor } from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
export const InterceptorSkipHeader = 'X-Skip-Interceptor';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private http: HttpClient) { }
  messages: string[] = [];
  // adminData: any = {};
  add(message: string) {
    this.messages.push(message);
  }
  clear() {
    this.messages = [];
  }
  getPieData() {
    return this.http.get('/assets/data/pieReport.json');
  }
  getFinalReport() {
    return this.http.get('/assets/data/allBranchesReport.json');
  }
  getTestsByCompany(subjetId) {
    // return this.http.get();
    // return [1, 2, 3, 4, 5];
  }
  getExamReport(subjectId, chapterId, collegeId) {
    return this.http.get('/assets/data/examReport.js');
  }
  getReportByCompany(subjectId, chapterId): Observable<any> {
    const options =  { params:
      new HttpParams()
      .set('subjectId', subjectId)
      .set('chapterId', chapterId)
      // .set('branch', window.sessionStorage.getItem('accessBranches'))
    };
    return this.http.get('/iesexamrest/collegeStudentReport', options)
    .pipe(map(data => data));
  }
  isValidAdminLogin(loginObj): Observable<any> {
    const options =  { params:
      new HttpParams()
      .set('email', loginObj.email)
      .set('password', loginObj.password)
    };
      return this.http.get('/iesexamrest/collegeAdminLogin', options)
      .pipe(map(data => data));
    }
    setAdminLoginData(data) {
      window.sessionStorage.setItem('currentUser', data);
      // window.sessionStorage.setItem('accessBranches', data.accessBranches);
      // this.adminData = data;
    }
    getSubjectsAndChapters() {
      const headers = new HttpHeaders().set(InterceptorSkipHeader, 'AdminInterceptor');
      return this.http.get('/assets/data/subjectChapter.json', {headers});
    }
      // onLogoutUser() {
      //   window.sessionStorage.removeItem('currentUser');
      // }
}
