import { Component, OnInit , ViewChild} from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { commandHistory } from '../../core/post';
import { BeatServiceService } from '../../services/beat-service.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { DatePipe } from '@angular/common';

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
export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD-MMM-YY HH:mm',
  fullPickerInput: 'DD-MMM-YY HH:mm',
  datePickerInput: 'LL',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@Component({
  selector: 'app-command-history',
  templateUrl: './command-history.component.html',
  styleUrls: ['./command-history.component.css'],
  providers: [DatePipe,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: ISO_FORMAT},
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
  ]
})
export class CommandHistoryComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  tableHeader: Array<string> = ['name','deviceId','command','commandDeliveredMsg','deviceCommandResponse','timestamp', 'login_name'];
  dataSource: MatTableDataSource<commandHistory>;
  loading: boolean = false;
  data:any;
  dateRangeCmdHistory: FormGroup;
  d:Date = new Date();
  maxDate: Date;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private beatService: BeatServiceService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.getCommandHistoryDetails();
    this.dateRangeCmdHistory = this.fb.group({
      'startTime': ['', Validators.required],
      'endTime': ['', Validators.required]
    })

   
  }
  get f() { return this.dateRangeCmdHistory.controls; }
  
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  getCommandHistoryDetails() {
    var todayDate = new Date();
    var newDate = new Date(new Date().setDate(new Date().getDate()-6));
    var curDateTime = todayDate.setSeconds(todayDate.getSeconds() + 300);
    let timeFormat = {
      sTime:  Math.floor(new Date(newDate).getTime()/1000),
      eTime: Math.floor(new Date(curDateTime).getTime()/1000)
     }
  // console.log(timeFormat)  
    this.loading = true;
    this.beatService.GetDevicesCommandHistory(timeFormat).subscribe((res: Array<commandHistory>)=> {
      this.loading = false;
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'cmndHistoryNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.data = res;
        this.dataSource = new MatTableDataSource<commandHistory>(this.data);
        // console.log("this.datasource", this.dataSource)
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

  submit() {
    let timeFormat = {
     sTime: Math.floor(this.dateRangeCmdHistory.get('startTime').value._d.getTime()/1000),
     eTime: Math.floor(this.dateRangeCmdHistory.get('endTime').value._d.getTime()/1000)
    }

    this.loading = true;
    this.beatService.GetDevCmdHistoryDateWise(Object.assign(timeFormat, this.dateRangeCmdHistory.value)).subscribe((res: Array<commandHistory>)=> {
      this.loading = false;
      
      // console.log("this.datasource", res)
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'cmndHistoryNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.data = res;
        this.dataSource = new MatTableDataSource<commandHistory>(this.data);
        // console.log("this.datasource", this.dataSource)
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
}
  
