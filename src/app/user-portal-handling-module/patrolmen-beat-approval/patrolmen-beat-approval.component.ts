import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { PetrolmanBeatList } from '../../core/post';
import { BeatServiceService } from '../../services/beat-service.service';

@Component({
  selector: 'app-patrolmen-beat-approval',
  templateUrl: './patrolmen-beat-approval.component.html',
  styleUrls: ['./patrolmen-beat-approval.component.css']
})
export class PatrolmenBeatApprovalComponent implements OnInit {
  title: string;
  message: string;
  beatData: any=[];
  beatId: any;
  existingBeatdata :any;
  constructor(public dialogRef: MatDialogRef<PatrolmenBeatApprovalComponent>,
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
        this.beatService.ApprovePatrolmenBeatForUser(this.beatId)
            .subscribe((data)=>{
              this.dialogRef.close();
              console.log("data approved", data)
            })
      }
    
      onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close('0');
      }

}
