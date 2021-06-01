import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { KeyManBeatList } from '../../core/userHandleModel';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { Message } from 'src/app/core/message.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subject } from 'rxjs';
import { BeatServiceService } from '../../services/beat-service.service';

@Component({
  selector: 'app-edit-keymen-beats',
  templateUrl: './edit-keymen-beats.component.html',
  styleUrls: ['./edit-keymen-beats.component.css']
})
export class EditKeymenBeatsComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  private ngUnsubscribe: Subject<any> = new Subject();
  updateKeymanForm: FormGroup;
  beatData: any = [];
  section: any;
  loading: any;
  parentId: any;

  constructor(public dialogRef: MatDialogRef<EditKeymenBeatsComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public keymenData,
    public dialog: MatDialog,
    private beatService: BeatServiceService,) { }

  ngOnInit() {
    this.beatData = this.keymenData;
    this.parentId = this.beatData.parentId;
    console.log("data", this.beatData);
    this.updateKeymanForm = this.fb.group({
      studentId: new FormControl(this.beatData.studentId),
      beatId:new FormControl(this.beatData.beatId),
      deviceName:new FormControl(this.beatData.Devicename, Validators.required),
      deviceImei: new FormControl(this.beatData.DeviceId, Validators.required),
      kmStart: new FormControl(this.beatData.KmStart, Validators.required),
      kmEnd: new FormControl(this.beatData.KmEnd, Validators.required),
      sectionName: new FormControl(this.beatData.SectionName, Validators.required),
      email:  new FormControl(this.beatData.EmailWhoInsert, Validators.required),
    }); 

    this.getSectionName();
  }

  getSectionName() {
    this.loading = true;
    this.beatService.getSectionName(this.parentId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe(data => {
      this.loading = false;
      this.section = data
    })
  }

  updateKeymanBeat() {
    if(this.beatData.isApprove === true) {
      console.log("data after")
    this.loading = true;
    this.beatService.UpdateKeymanBeatfromUserPortal(this.updateKeymanForm.value)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: Message)=>{
        // console.log("data after", data)
        if(data.error == "true"){
          this.loading = false;
          this.dialogRef.close();
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'BeatNotUpdated'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        } else {
          this.loading = false;
          this.dialogRef.close()
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'BeatUpdated'
          };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        // console.log("data approved", data)
      }
    })
  } else if(this.beatData.isApprove === false) {
      // console.log("data false before")
      this.loading = true;
      this.beatService.UpdateKeymanBeatfromUserPortalBeforeApprove(this.updateKeymanForm.value)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          console.log("data before", data)
          if(data.error == "true"){
            this.loading = false;
            this.dialogRef.close();
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'BeatNotUpdated'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          } else {
            this.loading = false;
            this.dialogRef.close();
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'BeatUpdated'
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          // console.log("data approved", data)
        }
      })
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
