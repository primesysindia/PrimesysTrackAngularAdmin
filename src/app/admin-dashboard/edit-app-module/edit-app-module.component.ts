import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { Message } from 'src/app/core/message.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-edit-app-module',
  templateUrl: './edit-app-module.component.html',
  styleUrls: ['./edit-app-module.component.css']
})
export class EditAppModuleComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public event: EventEmitter<any> = new EventEmitter();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  updateModuleForm: FormGroup;
  recievedData: any;
  loading: boolean;

  constructor(public dialogRef: MatDialogRef<EditAppModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,  private beatService: BeatServiceService,
   public dialog: MatDialog, private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.data);
    this.updateModuleForm = this.fb.group({
      'moduleId': new FormControl(this.data.response.moduleId, Validators.required),
      'ModuleName': new FormControl(this.data.response.module, Validators.required),
      'ModuleTitle': new FormControl(this.data.response.moduleTitle, Validators.required),
      'ModuleActivity': new FormControl(this.data.response.moduleActivity, Validators.required),
      'Description': new FormControl(this.data.response.moduleDesc, Validators.required),
      'status': new FormControl(this.data.response.isEnable_forDemo, Validators.required),
    })
  }

  updateModule(input: FormData) {
    // console.log("data",this.updateModuleForm.value)
    this.beatService.updateAppModule(Object.assign(this.data.response.moduleId, this.updateModuleForm.value))
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          console.log("data", data)
          if(data.error == "true"){
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'moduleNotUpdated'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          } else {
            this.loading = false;
            this.dialogRef.close()
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'moduleUpdated'
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
        })
  }

  resetForm(){
    this.updateModuleForm.reset();
  }

  onNoClick() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
