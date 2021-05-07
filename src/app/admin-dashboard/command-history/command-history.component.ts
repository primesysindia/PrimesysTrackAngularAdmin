import { Component, OnInit, Input, OnChanges, ChangeDetectorRef} from '@angular/core';
import { BeatServiceService } from '../../services/beat-service.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { CommandExcelService } from '../../services/command-excel.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { DatePipe } from '@angular/common';

export class USERS {
  deviceId: string;
  name: string;
  command: string;
  commandResponse: string;
  deviceResponse: string;
  commandDeliveryStatus: string;
  deviceCommandResponse: string;
  timestamp: number;
  studentId: number;
  deviceResponseTime: number;
  login_name: string
}
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
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS}
  ]
  
})
export class CommandHistoryComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  @Input() groupFilters: Object;
  @Input() searchByKeyword: string;
  users: any[] = [];
  response: any[] = [];
  filteredUsers: any[] = [];
  filteredUsersss:any;
  filterUserListss:any[] = [];
  loading: boolean = false;
  dateRangeCmdHistory:  FormGroup
  constructor(private beatService: BeatServiceService, private excelServ: CommandExcelService,
  public dialog: MatDialog,
  private ref: ChangeDetectorRef, 
  public fb: FormBuilder) { }
  ngOnInit(): void {
      this.dateRangeCmdHistory = this.fb.group({
      'startTime': ['', Validators.required],
      'endTime': ['', Validators.required]
    })
  // this.loadUsers();
  }
  ngOnChanges(): void {
    if (this.groupFilters) this.filterUserList(this.groupFilters, this.users);

  }
  filterUserList(filters: any, users: any): void {
        // console.log("filters", filters)
      this.filteredUsers = this.users; //Reset User List
      const keys = Object.keys(filters);
      // console.log("keys", keys)
      const filterUserList = user => {
      let result = keys.map(key => {
      if(user[key]) {
      return String(user[key]).toLowerCase().startsWith(String(filters[key]).toLowerCase())
      } else {
      return false;
      }
      });
      // To Clean Array from undefined if the age is passed so the map will fill the gap with (undefined)
      result = result.filter(it => it !== undefined);
      return result.reduce((acc, cur: any) => { return acc & cur }, 1)
      }
      this.filteredUsers = this.users.filter(filterUserList);
      console.log("this.filter",this.filteredUsers)

  }
  // loadUsers(): void {
  //   this.loading = true;
  //     var todayDate = new Date();
  //     var newDate = new Date(new Date().setDate(new Date().getDate()-6));
  //     var curDateTime = todayDate.setSeconds(todayDate.getSeconds() + 300);
  //     let timeFormat = {
  //       sTime:  Math.floor(new Date(newDate).getTime()/1000),
  //       eTime: Math.floor(new Date(curDateTime).getTime()/1000)
  //     }
  //     this.beatService.GetDevicesCommandHistory(timeFormat).subscribe((res: Array<USERS>)=> {
  //       this.users = res;
  //       this.loading = false;
  //       console.log("this.res",this.users)

  //       this.filteredUsers = this.filteredUsers.length > 0 ? this.filteredUsers : this.users;
  //       console.log("this.filteredUsers",this.filteredUsers)
  //     })
  //     this.loading = false;
  // }

  loadUsers(): void {
    let timeFormat = {
     sTime: Math.floor(this.dateRangeCmdHistory.get('startTime').value._d.getTime()/1000),
     eTime: Math.floor(this.dateRangeCmdHistory.get('endTime').value._d.getTime()/1000)
    }

    this.loading = true;
    this.beatService.GetDevCmdHistoryDateWise(Object.assign(timeFormat, this.dateRangeCmdHistory.value)).subscribe((res: Array<USERS>)=> {
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
        this.users = res;
        this.loading = false;
        console.log("this.res",this.response)

        this.filteredUsers = this.filteredUsers.length > 0 ? this.filteredUsers : this.users;
      
        console.log(" this.filteredUsers",  this.filteredUsers)
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

  downloadFile(){
        this.excelServ.generatecommandHistoryExcel(this.filteredUsers);
  }
  
}

