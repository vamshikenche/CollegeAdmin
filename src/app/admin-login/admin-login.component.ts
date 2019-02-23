import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
// import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import {MessageService} from '../message.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(private http: HttpClient, private messageService: MessageService, public router: Router) { }
  loginDetails =  {
    'email' : '',
    'password': ''
  };
  loginStatus = '';
  onSubmitLogin() {
    this.messageService.isValidAdminLogin(this.loginDetails).subscribe(
      data => {
        if (data) {
          this.loginStatus = '';
          this.messageService.setAdminLoginData(data);
          this.router.navigate(['/reports']);
        } else {
          this.loginStatus = '* You are not an authorized user.';
        }
      }
    );
  }
  ngOnInit() {
    // document.getElementById('loader').style.display = 'none';
    if (window.sessionStorage.getItem('currentUser')) {
      this.router.navigate(['/reports']);
    }
    return false;
  }
}
