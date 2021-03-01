import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { PetrolmanBeatList } from '../../core/post';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-approve-patrolman',
  templateUrl: './approve-patrolman.component.html',
  styleUrls: ['./approve-patrolman.component.css']
})
export class ApprovePatrolmanComponent implements OnInit {
  title: string;
  message: string;
  beatData: any=[];
  constructor(public dialogRef: MatDialogRef<ApprovePatrolmanComponent>,
      @Inject(MAT_DIALOG_DATA) public patrolmanlist: PetrolmanBeatList, 
      private beatService: BeatServiceService  )
      {}
      
  ngOnInit() {
    this.beatData = this.patrolmanlist;
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.beatService.ApprovePatrolManBeat(this.beatData[0])
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
