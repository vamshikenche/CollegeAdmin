import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
@Injectable()
export class AdminInterceptor  implements HttpInterceptor {
    constructor() { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const full = window.location.host;
    // window.location.host is subdomain.domain.com
    const parts = full.split('.');
    const sub = parts[0];
    let collegeId = '';
    switch (sub) {
        case 'bcrec':
        collegeId = '26';
        break;
    }
    req = req.clone({
        setParams: {
          'collegeId': '26'
        }
      });
    return next.handle(req);
    }
}
