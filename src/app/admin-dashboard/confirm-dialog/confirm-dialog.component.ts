import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { KeyManBeatList, PostKeymanData } from '../../core/post';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  title: string;
  message: string;
  beatData: any=[];
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public keymanlist: KeyManBeatList, private beatService: BeatServiceService  ) {
    // Update view with given values
    // this.title = data.title;
    // this.message = data.message;
    // console.log("this.keymanlist", dt.keymanlist);
  }

  ngOnInit() {
    this.beatData = this.keymanlist;
    // console.log("this.keymanlist", this.beatData);
  }

  onConfirm(): void {
    // Close the dialog, return true
    // console.log("this.beatData", this.beatData[0])
    this.beatService.ApproveKeymanBeat(this.beatData[0])
        .subscribe((data)=>{
          this.dialogRef.close();
          // console.log("data approved", data)
        })
    // this.dialogRef.close('1');
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close('0');
  }
}

/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class ConfirmDialogModel {

  constructor(public title: string, public message: string) {
  }
}
