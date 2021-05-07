import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { InspectionData, ParentUserList } from '../../core/post';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { Message } from 'src/app/core/message.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-edit-inspection-form',
  templateUrl: './edit-inspection-form.component.html',
  styleUrls: ['./edit-inspection-form.component.css']
})
export class EditInspectionFormComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  private ngUnsubscribe: Subject<any> = new Subject();
  editInspectionForm: FormGroup;
  recievedData: any;
  loading: boolean;

  constructor(public dialogRef: MatDialogRef<EditInspectionFormComponent>,
    private beatService: BeatServiceService,
     private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog) { }

  ngOnInit() {
    console.log("data", this.data)
    this.recievedData = this.data;
    this.editInspectionForm = this.fb.group({
      issueTitle: new FormControl(this.recievedData.data.issueTitle, Validators.required),
      issueDesc: new FormControl(this.recievedData.data.issueDescription, Validators.required),
      finalReport: new FormControl(this.recievedData.data.finalTestingReport, Validators.required),
      contactPerson: new FormControl(this.recievedData.data.contactPerson, Validators.required),
      inspectedBy: new FormControl(this.recievedData.data.inspectdBy, Validators.required),
      // InspectionDate: new FormControl(this.recievedData.data.inspectedBy, Validators.required),
      isReusable:  new FormControl(false)
    })
  }

  submit() {
    // console.log(this.inspectionForm.value)
    let param = {
      // actDate: this.datepipe.transform(this.inspectionForm.get('InspectionDate').value, 'MM-dd-yyyy'),
      deviceNo: this.recievedData.data.studentId,
      inspectionId: this.recievedData.data.inspectionId
    }
    this.loading = true;
    this.beatService.editInspectionForm(Object.assign(param,this.editInspectionForm.value))
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: Message)=>{
        console.log("data", data)
        if(data.error == "true"){
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'DataNotUpdated'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        } else {
          this.loading = false;
          this.dialogRef.close()
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'DataUpdated'
          };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig);
        // this.getInspectionData();
        }
      })
  }

   onNoClick() {
    this.dialogRef.close()
  }
}
