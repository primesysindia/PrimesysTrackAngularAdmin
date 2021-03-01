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
  selector: 'app-confirmdev-ex-beat',
  templateUrl: './confirmdev-ex-beat.component.html',
  styleUrls: ['./confirmdev-ex-beat.component.css']
})
export class ConfirmdevExBeatComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading: boolean;

  constructor(public dialogRef: MatDialogRef<ConfirmdevExBeatComponent>,
    @Inject(MAT_DIALOG_DATA) public data,  
    public dialog: MatDialog,
    private beatService: BeatServiceService) { }

  ngOnInit() {
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.loading = true;
    this.beatService.ExchangeDeviceAndBeatUpdate(this.data)
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
