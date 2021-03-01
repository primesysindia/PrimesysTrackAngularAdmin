import { Component, OnInit , ViewChild} from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { IssueList, fileList } from '../../core/post';
import { BeatServiceService } from '../../services/beat-service.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EditIssueComponent } from '../edit-issue/edit-issue.component';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { SendMailComponent } from '../send-mail/send-mail.component';
import * as _moment from 'moment';
import { ExcelServiceService } from '../../services/excel-service.service';
import { ViewCustomerIssuesComponent } from '../view-customer-issues/view-customer-issues.component';

const moment = _moment;
export const ISO_FORMAT = {
  parse: {
      dateInput: 'LL',
  },
  display: {
      dateInput: 'DD-MMM-YY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-customer-issues',
  templateUrl: './customer-issues.component.html',
  styleUrls: ['./customer-issues.component.css'],
   animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: ISO_FORMAT},
  ]
})
export class CustomerIssuesComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  dataSource: MatTableDataSource<IssueList>;
  loading: boolean = false;
  data:any;
  issueData: any;
  tableHeader: Array<string> = ['issueTicketId','divisionName', 'deviceName', 'issueTitle', 'contactPerson', 'contactPersonMobNo',  
  'issueStatus', 'priority', 'view', 'edit' ];
  
  innerDisplayedColumns = ['fileName', 'download'];
  fileAttachmentUrl: string = 'http://primesystech.com/PrimesysTrackReport/PrimesysAdminIssueAttachedFile/'
  expandedElement: any;
  getDateRangeForm: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private beatService: BeatServiceService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    private excelServ: ExcelServiceService ) {}

  ngOnInit() {
      this.getIssueDetails();
    this.getDateRangeForm = this.fb.group({
      'startDate': ['', Validators.required],
      'endDate': ['', Validators.required]
    })
  }

  submit() {
    let timeFormat = {
     sTime: this.getDateRangeForm.get('startDate').value._d.getTime()/1000,
     eTime: Math.floor(this.getDateRangeForm.get('endDate').value._d.getTime()/1000)
    }
    this.loading = true;
    this.beatService.getIssueDetailsWithDateRange(Object.assign(timeFormat, this.getDateRangeForm.value) )
    .subscribe((data: Array<IssueList>)=>{
      this.loading = false;
    if(data.length == 0){
      this.loading = false;
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.data = {
        hint: 'issueHistoryNotFound'
      };
      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
    } else {
      this.data = data;
      console.log("data", this.data)
      this.issueData = new MatTableDataSource<IssueList>(this.data);
      this.dataSource = this.issueData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  },(err) => {
    this.loading = false;
      const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'ServerError'
          };
      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
  })
  
}

applyFilter(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  this.dataSource.filter = filterValue;
}

getIssueDetails() {
  this.loading = true;
  this.beatService.getAllCustomerIssue().subscribe((res: Array<IssueList>)=> {
    this.loading = false;
    console.log(res);
    if(res.length == 0){
      this.loading = false;
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.data = {
        hint: 'issueHistoryNotFound'
      };
      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
    } else {
      this.data = res;
      // this.fileList = new MatTableDataSource<fileList>(this.data.fileList);
      this.issueData = new MatTableDataSource<IssueList>(this.data);
      this.dataSource = this.issueData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  },(err) => {
    this.loading = false;
      const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'ServerError'
          };
      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
  })
}

 // open edit issue form dialog
 openEditDialog(issueId) {
  localStorage.setItem('issueId',JSON.stringify(issueId))
  const dialogConfig = new MatDialogConfig();

  this.beatService.getIssueDetailById(issueId).subscribe((res: Array<IssueList>)=> {
    dialogConfig.width = '1000px';
    dialogConfig.height = '550px';
    dialogConfig.data = res;
    // console.log("id",dialogConfig.data)

    let dialogRef = this.dialog.open(EditIssueComponent, dialogConfig)
    .afterClosed().subscribe((result) => {
      this.getIssueDetails();
    })
})
}

openViewDialog(rowData) {

  var rowInfo = rowData;
  const dialogConfig = new MatDialogConfig();
//   dialogConfig.data = {
//     // width: '550px',
//     // height: '500px',
//     data: rowInfo
// };
  dialogConfig.width = '550px';
  dialogConfig.height = '350px';
  dialogConfig.data = rowData;
    let dialogRef = this.dialog.open(ViewCustomerIssuesComponent, dialogConfig)
    .afterClosed().subscribe((result) => {
    })

}

}
