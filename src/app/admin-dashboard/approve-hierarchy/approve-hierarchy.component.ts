import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { getHierarchyData} from '../../core/post';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-approve-hierarchy',
  templateUrl: './approve-hierarchy.component.html',
  styleUrls: ['./approve-hierarchy.component.css']
})
export class ApproveHierarchyComponent implements OnInit {
  hierarchyData: any=[];

  constructor(public dialogRef: MatDialogRef<ApproveHierarchyComponent>,
    @Inject(MAT_DIALOG_DATA) public hierarchylist: getHierarchyData, 
    private beatService: BeatServiceService ) { }

  ngOnInit() {
    this.hierarchyData = this.hierarchylist;
    console.log(this.hierarchyData)
  }
  onConfirm(): void {
    // Close the dialog, return true
    this.beatService.approveHierarchy(this.hierarchyData[0])
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
