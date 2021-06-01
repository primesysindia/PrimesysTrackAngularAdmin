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
  selector: 'app-delete-user-utility',
  templateUrl: './delete-user-utility.component.html',
  styleUrls: ['./delete-user-utility.component.css']
})
export class DeleteUserUtilityComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading : boolean;
  recievedData: any;

  constructor(private beatService: BeatServiceService,
    public dialogRef: MatDialogRef<DeleteUserUtilityComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data ) { 
      this.recievedData = data;
    }

  ngOnInit() {
    console.log("recieved",this.recievedData);
    // this.recievedData = this.data;
  }

  delete() {
    this.loading = true;
    this.beatService.DeleteUtilityModule(this.recievedData.data)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          console.log("data", data)
          if(data.error == "true"){
            this.loading = false;
            this.dialogRef.close();
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'notDeleted'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
          else {
            this.loading = false;
            this.dialogRef.close();
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'Deleted'
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
