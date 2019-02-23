import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PerformanceReportComponent } from './performance-report/performance-report.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {enableProdMode} from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatSort, MatTableModule} from '@angular/material';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {KeysPipe} from './collegeReport.pipe';
import {AdminLoginComponent} from './admin-login/admin-login.component';
import {AdminInterceptor} from './admin-interceptor';
import {RouterModule, Routes} from '@angular/router';
import {AppRoutingModule} from './/app-routing.module';

enableProdMode();
@NgModule({
  declarations: [
    AppComponent,
    PerformanceReportComponent,
    KeysPipe,
    AdminLoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Ng2GoogleChartsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatTabsModule,
    MatCardModule,
    MatExpansionModule,
    MatRadioModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminInterceptor,
      multi: true
    },BrowserModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
