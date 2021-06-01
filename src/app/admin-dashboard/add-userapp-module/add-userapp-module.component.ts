import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { Message } from 'src/app/core/message.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-add-userapp-module',
  templateUrl: './add-userapp-module.component.html',
  styleUrls: ['./add-userapp-module.component.css']
})
export class AddUserappModuleComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public event: EventEmitter<any> = new EventEmitter();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  addModuleForm: FormGroup;
  loading: boolean;

  constructor(public dialogRef: MatDialogRef<AddUserappModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public mdata: any,  private beatService: BeatServiceService,
   public dialog: MatDialog, private fb: FormBuilder) { }

  ngOnInit() {
    this.addModuleForm = this.fb.group({
      'ModuleName': ['', Validators.required],
      'ModuleTitle': ['', [Validators.required]],
      'ModuleActivity': ['', Validators.required],
      'Description': ['', Validators.required],
      'status': ['', Validators.required]
    })
  }

  saveModuleForm(input: FormData) {
    // console.log("data",this.addModuleForm.value)
    this.loading = true;
    this.beatService.saveAppModule(this.addModuleForm.value)
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
    this.addModuleForm.reset();
  }

  onNoClick() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
