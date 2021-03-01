import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';
import { Message } from 'src/app/core/message.model';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-confirm-device-unregister',
  templateUrl: './confirm-device-unregister.component.html',
  styleUrls: ['./confirm-device-unregister.component.css']
})
export class ConfirmDeviceUnregisterComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading : boolean;
  imeiNo: any;

  constructor(public dialogRef: MatDialogRef<ConfirmDeviceUnregisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data,  
    public dialog: MatDialog, 
    // private resp: DeviceRemoveUnregisterComponent, 
    private beatService: BeatServiceService) { 
    }

  ngOnInit() {
    this.imeiNo = this.data.reqData;
    // console.log("data",this.data)
  }

  deviceUnregister() {
    // this.loading = true;
        this.beatService.DeviceUnRegisterAPI(this.imeiNo)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          console.log("data", data)
          if(data.error == "true"){
            this.loading = false;
            this.dialogRef.close();
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'unregisteredUnsuccessful'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          } else {
            this.loading = false;
            this.dialogRef.close();
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'unregisteredSuccessful'
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
      })
  }

  onDismiss() {
    this.dialogRef.close();
  }
}
