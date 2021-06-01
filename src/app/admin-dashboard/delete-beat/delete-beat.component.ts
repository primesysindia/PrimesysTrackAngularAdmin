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
  selector: 'app-delete-beat',
  templateUrl: './delete-beat.component.html',
  styleUrls: ['./delete-beat.component.css']
})
export class DeleteBeatComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading : boolean;
  hint: any;
  beat: any;
  currUser: any;
  userLoginId: any;
  showKeyman: boolean = false;
  showPatrolman : boolean = false;

  constructor(private beatService: BeatServiceService,
    public dialogRef: MatDialogRef<DeleteBeatComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data        
    ) {
      this.hint = data.hint; 
      this.beat = data.beatId;
      // console.log("data", data)
    }

  ngOnInit() {
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.userLoginId = this.currUser.usrId;

    if(this.hint == 'keymanBeatDelete') {
      this.showKeyman = true;
    } 
    else if(this.hint == 'patrolmanBeatDelete') {
      this.showPatrolman = true;
    }
   }

   onKeymanConfirm() {
    this.loading = true;
    this.beatService.DeleteKeymanBeat(this.beat, this.userLoginId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          // console.log("data", data)
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

  onPatrolmanConfirm() {
    this.loading = true;
    this.beatService.DeletePatrolmanBeat(this.beat, this.userLoginId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          // console.log("data", data)
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
}
