import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import {MessageService} from '../message.service';
import {Observable, of} from 'rxjs';
import {catchError, map, tap } from 'rxjs/operators';
import {MatRadioModule} from '@angular/material/radio';
import {MatSort, MatTableDataSource} from '@angular/material';
import {MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {subChaps} from '../subjectChapter';
import { Router } from '@angular/router';
@Component({
  selector: 'app-performance-report',
  templateUrl: './performance-report.component.html',
  styleUrls: ['./performance-report.component.css']
})
export class PerformanceReportComponent implements OnInit {
  panelOpenState = false;
  pieData = {};
  selectedCompany = {};
  selectedTest = {};
  activeTab1 = 0;
  activeTab2 = 0;
  Object = Object;
  @ViewChild(MatSort) sort: MatSort;
  qualified: any = new MatTableDataSource([]);
  unqualified: any = new MatTableDataSource([]);
  notattempted: any = new MatTableDataSource([]);
  finalReportData = {};
  pieChartData = {};
  pieChartArr = [];
  reportPanelState = false;
  displayedColumns = ['emailId', 'totalQuestions', 'attempted', 'correctAnswered'];
  subjectTests = ['PlacementPaper-1', 'PlacementPaper-2', 'PlacementPaper-3', 'PlacementPaper-4', 'PlacementPaper-5'];
  subjectChapters = subChaps;
  chapterList = [];
  expPanelState = true;
  loaderState = false;
  jsonFile = './assets/data/pieReport.json';
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  constructor(private http: HttpClient, private messageService: MessageService, public router: Router) {}
  public getPieData() {
    this.messageService.getFinalReport().subscribe(
      data => {
        this.prepareStudentReportData(data);
        setTimeout(() => {
          this.reportPanelState = true;
          this.expPanelState = true;
          this.loaderState = false;
          this.activeTab1 = 0;
          this.activeTab2 = 0;
        }, 300);
      }
    );
  }

  prepareStudentReportData(data) {
    for (const branchName of this.Object.keys(data)) {
      this.qualified = new MatTableDataSource(data[branchName]['qualified']);
      this.unqualified = new MatTableDataSource(data[branchName]['unqualified']);
      this.notattempted = new MatTableDataSource(data[branchName]['notattempted']);
      this.qualified.sort = this.sort;
      this.unqualified.sort = this.sort;
      this.notattempted.sort = this.sort;
      this.pieChartData =  {
        chartType: 'PieChart',
        width: 150,
        height: 150,
        dataTable: [
          ['Task', 'Student Report'],
          ['Qualified', 0],
          ['Unqualified', 0],
          ['Not Attempted', 0]
        ],
        chartArea: { left: 0, top: 0, width: '100%', height: '100%'},
        options: {'title': '',
        is3D: false,
        pieSliceText: 'value',
        slices: [{color: '#ec8f6e'}, {color: '#e0440e'}, {color: '#f6c7b6'}]}
      };
      this.pieChartData['options'].title = '';
      if (this.qualified.data.length) {
        this.pieChartData['dataTable'][1][1] = parseInt(this.qualified.data.length, 10);
      }
      if (this.unqualified.data.length) {
        this.pieChartData['dataTable'][2][1] = parseInt(this.unqualified.data.length, 10);
      }
      if (this.notattempted.data.length) {
        this.pieChartData['dataTable'][3][1] = parseInt(this.notattempted.data.length, 10);
      }
      this.finalReportData[branchName] = {
        'qualified' : this.qualified,
        'unqualified': this.unqualified,
        'notattempted': this.notattempted,
      };
      this.pieChartArr[branchName] = this.pieChartData;
    }
  }

  // public getSubjectsAndChapters() {
  //   this.subjectChapters = subChaps;
  // }

  public getTestsByCompany(subjectId) {
    // this.totalTests = this.messageService.getTestsByCompany(subjectId);
  }

  public onCompanySelected (company, index, event) {
    if (event.isUserInput) {
      this.selectedCompany = company;
      this.chapterList = company.chapter;
      this.expPanelState = false;
      this.reportPanelState = false;
      this.loaderState = false;
    }
  }

  public onTestSelected(test, index, event) {
    this.loaderState = false;
    if (event.isUserInput) {
      this.selectedTest = test;
      if (this.selectedTest) {
        this.loaderState = true;
        this.messageService.getReportByCompany(this.selectedCompany['id'], this.selectedTest['id']).subscribe(
          data => {
            this.prepareStudentReportData(data);
            setTimeout(() => {
              this.reportPanelState = true;
              this.expPanelState = true;
              this.loaderState = false;
            }, 300);
          }
        );
      } else {
        this.loaderState = false;
        this.reportPanelState = false;
        this.expPanelState = false;
      }
    }
    // this.getPieData(); // for testing purpose
  }

  public getExpPanelState() {
    if (this.selectedCompany && this.selectedCompany['id']) {
      this.reportPanelState = true;
      this.expPanelState = true;
    } else {
      this.reportPanelState = false;
      this.expPanelState = false;
    }
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  applyFilter(filterValue: string, dataSource) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    dataSource.filter = filterValue;
  }
  compareValues(key, order = 'asc') {
    return function(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
          return 0;
      }
      let comparison = 0;
      if (key === 'emailId') {
        const varA = (typeof a[key] === 'string') ?
        a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ?
        b[key].toUpperCase() : b[key];

        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
      } else {
        const varA = parseInt(a[key], 10);
        const varB = parseInt(b[key], 10);
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }
  sortData(refData, studCategory, branch, $event) {
      this.finalReportData[branch][studCategory].data = refData.data.sort(this.compareValues($event.active, $event.direction));
  }

  onClickPie(event) {
    console.log(event);
  }

  onLogoutUser() {
    this.router.navigate(['/login']);
    window.sessionStorage.removeItem('currentUser');
    // window.sessionStorage.removeItem('accessBranches');
  }

  ngOnInit() {
    document.getElementById('loader').style.display = 'none';
    this.getExpPanelState();
    // this.getPieData();
    // this.getSubjectsAndChapters();
    if (!(window.sessionStorage.getItem('currentUser'))) {
      this.router.navigate(['/login']);
      return false; 
    }
  }
}
