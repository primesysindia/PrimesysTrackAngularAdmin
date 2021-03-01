import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { PetrolmanBeatList } from '../../core/post';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';
import { Message } from 'src/app/core/message.model';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-confirm-deviceexcahnge',
  templateUrl: './confirm-deviceexcahnge.component.html',
  styleUrls: ['./confirm-deviceexcahnge.component.css']
})
export class ConfirmDeviceexcahngeComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading : boolean;

  constructor(public dialogRef: MatDialogRef<ConfirmDeviceexcahngeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,  
    public dialog: MatDialog,
    private beatService: BeatServiceService) { }

  ngOnInit() {

    // console.log("data", this.data);
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.loading = true;
    this.beatService.updateDeviceExchange(this.data)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          console.log("data", data)
          if(data.error == "true"){
            this.loading = false;
            this.dialogRef.close();
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'StudentNotExchanged'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
          else {
            this.loading = false;
            this.dialogRef.close();
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'StudentExchanged'
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
     })
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close('0');
  }

}
