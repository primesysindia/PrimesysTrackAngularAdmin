import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { Message } from 'src/app/core/message.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-edit-user-utility',
  templateUrl: './edit-user-utility.component.html',
  styleUrls: ['./edit-user-utility.component.css']
})
export class EditUserUtilityComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public event: EventEmitter<any> = new EventEmitter();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  editUtilityForm: FormGroup;
  recievedData: any;
  loading: boolean;

  constructor(public dialogRef: MatDialogRef<EditUserUtilityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,  private beatService: BeatServiceService,
   public dialog: MatDialog, private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.data);

    this.editUtilityForm = this.fb.group({
      'utilityId': new FormControl(this.data.response.utilityId, Validators.required),
      'UtilityName': new FormControl(this.data.response.utility, Validators.required),
      'UtilityTitle': new FormControl(this.data.response.utilityTitle, Validators.required),
      'UtilityActivity': new FormControl(this.data.response.utilityActivity, Validators.required),
      'Description': new FormControl(this.data.response.utilityDesc, Validators.required),
      'status': new FormControl(this.data.response.isEnable_forDemo, Validators.required),
    })
  }

  updateUtilityForm(input: FormData) {
    // console.log("data",this.editUtilityForm.value)
    this.loading = true;
    this.beatService.updateUtilityModule(this.editUtilityForm.value)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          if(data.error == "true"){
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'moduleNotAdded'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          } else {
            this.loading = false;
            this.dialogRef.close()
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'moduleAdded'
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
        })
  }

  resetForm(){
    this.editUtilityForm.reset();
  }

  onNoClick() {
    this.dialogRef.close()
  }
}
