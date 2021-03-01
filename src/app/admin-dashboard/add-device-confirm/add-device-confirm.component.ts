import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';
import { Message } from 'src/app/core/message.model';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-add-device-confirm',
  templateUrl: './add-device-confirm.component.html',
  styleUrls: ['./add-device-confirm.component.css']
})
export class AddDeviceConfirmComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading : boolean;
  data: any;
  formData: any;

  constructor(private beatService: BeatServiceService,
    public dialogRef: MatDialogRef<AddDeviceConfirmComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data        
    ) {
      this.data =data.params; 
      this.formData = data.data;
      // console.log("data", data)
    }

  ngOnInit() {
  }

  onConfirm() {
    this.loading = true;
     this.beatService.addSingleDevice(Object.assign(this.data, this.formData))
     .takeUntil(this.ngUnsubscribe)
     .subscribe((data: Message)=>{
       console.log("data",data)
       if(data.error == "true"){
        this.loading = false;
        this.dialogRef.close();
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'deviceNotAdded',
          message: data.message
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
      else {
        this.loading = false;
        this.dialogRef.close();
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'deviceAdded',
          message: data.message
        };
      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
    }
    })
  }

}
