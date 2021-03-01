import {  Component, OnInit, Inject, ViewChild, ElementRef,EventEmitter,Output, AfterViewInit,  OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BeatServiceService } from '../../services/beat-service.service';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { IssueList} from '../../core/post';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { User } from '../../core/user.model';

@Component({
  selector: 'app-view-customer-issues',
  templateUrl: './view-customer-issues.component.html',
  styleUrls: ['./view-customer-issues.component.css']
})
export class ViewCustomerIssuesComponent implements OnInit {
  loading: boolean;
  issueData: any=[];
  response: any;
  activation: any;
  timestamp: any;
  dateActivation: any;
  currDate: Date = new Date();
  warrantyMsg: boolean = false;
  expiredWarranty: boolean = false;
  beatInfo: any;
  dataSource :any = [];

  constructor(public dialogRef: MatDialogRef<ViewCustomerIssuesComponent>,
    private beatService: BeatServiceService, @Inject(MAT_DIALOG_DATA) public issuelist: IssueList,
    public dialog: MatDialog) { 
      // console.log(this.issuelist)
    }

  ngOnInit() {
    this.issueData = this.issuelist;

    this.loading = true;
    this.beatService.GetDeviceInfoAndIssue(this.issuelist.studentId, this.issuelist.deviceId).subscribe((res: Array<IssueList>)=> {
      this.loading = false;
      console.log("this.res", res)
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'issueHistoryNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.response = res;
        // console.log("fgdfg", this.data)
        this.activation = this.response.ActivationDate;
        var d: Date = new Date();
        var activeDate= new Date(this.activation);
        this.dateActivation = activeDate.setFullYear(activeDate.getFullYear() + 1); 
        
        this.timestamp = this.currDate.getTime();
        if(this.dateActivation <= this.timestamp ) {
          this.warrantyMsg = false;
          this.expiredWarranty = true;
        } else {
          this.expiredWarranty = false;
          this.warrantyMsg = true;
        }
        this.beatInfo = this.response.beatInfoList;
        console.log("this.beatInfo", this.beatInfo)
        // this.issueData = new MatTableDataSource<IssueList>(this.response.issueList);
        // this.dataSource = this.issueData;
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
