import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { PetrolmanBeatList } from '../../core/post';
import { BeatServiceService } from '../../services/beat-service.service';

@Component({
  selector: 'app-keymen-beat-approval',
  templateUrl: './keymen-beat-approval.component.html',
  styleUrls: ['./keymen-beat-approval.component.css']
})
export class KeymenBeatApprovalComponent implements OnInit {
  title: string;
  message: string;
  beatData: any=[];
  beatId: any;
  existingBeatdata :any;
  constructor(public dialogRef: MatDialogRef<KeymenBeatApprovalComponent>,
      @Inject(MAT_DIALOG_DATA) public keymenData, 
      private beatService: BeatServiceService  )
      {}

      ngOnInit() {
        this.beatData = this.keymenData;
        this.beatId = this.beatData.beatId;
        this.existingBeatdata = this.beatData.ExistingBeatId;
        // console.log(this.beatId)
      }
    
      onConfirm(): void {
        // Close the dialog, return true
        this.beatService.ApproveKeyManBeatForUser(this.beatId,this.existingBeatdata)
            .subscribe((data)=>{
              this.dialogRef.close();
              // console.log("data approved", data)
            })
      }
    
      onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close('0');
      }

}
