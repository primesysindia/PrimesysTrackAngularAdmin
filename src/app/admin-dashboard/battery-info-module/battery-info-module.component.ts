import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import { BeatServiceService } from '../../services/beat-service.service';
import { GetBatteryInfo } from '../../core/post';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-battery-info-module',
  templateUrl: './battery-info-module.component.html',
  styleUrls: ['./battery-info-module.component.css']
})
export class BatteryInfoModuleComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  imeiNo: any;
  startTime: any;
  endTime: any;
  response: any;
  tableHeader: Array<string> = ['status','timestamp'];
  dataSource :any = [];
  tableData: MatTableDataSource<GetBatteryInfo>;
  loading: boolean = true;

  constructor( private beatService: BeatServiceService,
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<BatteryInfoModuleComponent>,
    @Inject(MAT_DIALOG_DATA) data        
    ) {
      this.imeiNo =data.imei; 
      this.startTime = data.startDTime;
      this.endTime = data.endDTime
    }

  ngOnInit() {
    // console.log("data", this.imeiNo)
    this.beatService.GetBatteryStatus(this.imeiNo, this.startTime, this.endTime)
      .subscribe((data: Array<GetBatteryInfo>)=> {
        this.loading = false;
        if(data.length == 0){
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'batteryDataNotFound'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        } else {
          this.tableData = new MatTableDataSource<GetBatteryInfo>(data);
          this.dataSource = this.tableData;
          // console.log("datasource", this.dataSource)
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
