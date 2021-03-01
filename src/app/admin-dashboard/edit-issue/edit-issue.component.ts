import { Component, OnInit, EventEmitter, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IssueList } from '../../core/post';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { BeatServiceService } from '../../services/beat-service.service';
import { Message } from 'src/app/core/message.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-edit-issue',
  templateUrl: './edit-issue.component.html',
  styleUrls: ['./edit-issue.component.css']
})
export class EditIssueComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  editIssueForm: FormGroup;
  issue: any;
  showDescription: boolean = false;
  description: any;
  userLoginId: any;
  currUser: any;
  issueData: any=[];
  desc: FormGroup;
  issueOwner: any;
  createdAt: any;
  loading: boolean;

  constructor(public dialogRef: MatDialogRef<EditIssueComponent>,
    private beatService: BeatServiceService,
    private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public issuelist: IssueList ,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.issueData = this.issuelist;
    // console.log("data", this.issueData)
    this.issueOwner = this.issueData[0].issueOwner;
    this.createdAt = this.issueData[0].createdAt;
    this.editIssueForm = this.fb.group({
      'issue': new FormControl(this.issueData[0].issueTitle),
      'status': new FormControl(this.issueData[0].issueStatus, Validators.required),
      'priority': new FormControl(this.issueData[0].priority, Validators.required),
      'caller_name': new FormControl(this.issueData[0].contactPerson, Validators.required),
      'contact': new FormControl(this.issueData[0].contactPersonMobNo, Validators.required),
      'description': new FormControl(this.issueData[0].issueComment, Validators.required),
      'a_description': new FormControl(''),
      'isDeviceOn': new FormControl(this.issueData[0].isDeviceOn, Validators.required),
      'isDeviceButtonOn': new FormControl(this.issueData[0].isDeviceButtonOn, Validators.required),
      'isBatteryOn': new FormControl(this.issueData[0].isBatteryOn, Validators.required),
      'isImeiSIMCorrect': new FormControl(this.issueData[0].isImeiSIMCorrect, Validators.required),
      'isGSMOn': new FormControl(this.issueData[0].isGSMOn, Validators.required),
      'isGpsOn': new FormControl(this.issueData[0].isGpsOn, Validators.required),
    })

    // this.getIssueList();
  }
  getIssueList() {
    this.beatService.GetIssueList()
    .takeUntil(this.ngUnsubscribe)
    .subscribe(data => {
      this.issue = data;

    })
  }

  updateIssueForm() {
    let desc = {
      isBatteryOnS : +this.editIssueForm.get('isBatteryOn').value,
      isDeviceOnS: +this.editIssueForm.get('isDeviceOn').value,
      isImeiSIMCorrectS: +this.editIssueForm.get('isImeiSIMCorrect').value,
      isGSMOnS: +this.editIssueForm.get('isGSMOn').value,
      isDeviceButtonOnS: +this.editIssueForm.get('isDeviceButtonOn').value,
      isGpsOnS: +this.editIssueForm.get('isGpsOn').value,
      descrip : this.editIssueForm.get('description').value.concat(' ').concat(this.editIssueForm.get('a_description').value.toString())
    }
    this.loading = true; 
    this.beatService.updateIssue(Object.assign(desc, this.editIssueForm.value))
        .subscribe((data: Message)=>{
          if(data.error == "true"){
            this.loading = false;
            this.dialogRef.close();
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'IssueNotUpdated'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
           else {
            this.dialogRef.close();
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'IssueUpdated'
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
          // console.log("data", data)
        })
    }

    onNoClick() {
      this.dialogRef.close();
    }

    resetForm() {
      this.editIssueForm.reset();
    }
 }

