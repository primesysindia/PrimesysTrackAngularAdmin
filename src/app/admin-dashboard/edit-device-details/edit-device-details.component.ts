import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { BeatServiceService } from '../../services/beat-service.service';
import { MatDialog, MatDialogConfig,MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { GetAllDeviceInfo} from '../../core/post';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-edit-device-details',
  templateUrl: './edit-device-details.component.html',
  styleUrls: ['./edit-device-details.component.css']
})
export class EditDeviceDetailsComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public event: EventEmitter<any> = new EventEmitter();
  private ngUnsubscribe: Subject<any> = new Subject();
  allDevData: any=[];
  updateDeviceForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<EditDeviceDetailsComponent>,
    private beatService: BeatServiceService,
    private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public GetAllDeviceInfo,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.allDevData = this.GetAllDeviceInfo.response[0];
    console.log("edit form", this.allDevData)
    this.updateDeviceForm = this.fb.group({
      'uname': new FormControl(this.allDevData.userName),
      'fname' : new FormControl(this.allDevData.firstName),
      'lname' : new FormControl(this.allDevData.LastName),
      'imei' : new FormControl(this.allDevData.deviceId),
      'mobile_no' : new FormControl(this.allDevData.deviceSimNo),
      'sim_no' : new FormControl(this.allDevData.deviceSimNo),
    })
  }

}
