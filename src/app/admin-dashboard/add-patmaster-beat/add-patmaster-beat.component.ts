import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PetrolmanBeatList } from '../../core/post';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { Message } from 'src/app/core/message.model';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-add-patmaster-beat',
  templateUrl: './add-patmaster-beat.component.html',
  styleUrls: ['./add-patmaster-beat.component.css']
})
export class AddPatmasterBeatComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  beatData: Array<PetrolmanBeatList>;
  addMasterTrip: FormGroup;
  parentId: any;
  studentId: any;
  section: any;
  postData: any;
  totalKmCover: number;
  loading: boolean = false;

  public event: EventEmitter<any> = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<AddPatmasterBeatComponent>,
    @Inject(MAT_DIALOG_DATA) public mdata: any,
    private beatService: BeatServiceService, public dialog: MatDialog,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.parentId = JSON.parse(localStorage.getItem('ParentId')),
    this.studentId = localStorage.getItem('StudentID')
    // console.log("this.parentid", this.parentId)

    this.addMasterTrip = this.fb.group({
      'tripName': ['', Validators.required],
      'tripStartTime': ['', [Validators.required,
        Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')]],
      'tripEndTime': ['', [Validators.required,
        Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')]],
    })

   
  }
 
  get f() { return this.addMasterTrip.controls; }

  public hasError = (controlName: string, errorName: string) =>{
    return this.addMasterTrip.controls[controlName].hasError(errorName);
  }

  addMasterBeat(){
    var additionalParamater = {
      'pId': this.parentId
    }
    if(this.addMasterTrip.invalid)
      return
    else{
      // console.log("this.addMasterTrip.value", Object.assign(additionalParamater, this.addMasterTrip.value))
      this.loading = true;
      this.beatService.SavePatrolmanMasterBeat(Object.assign(additionalParamater, this.addMasterTrip.value))
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: Message)=>{
        // console.log("data",data)
        if(data.error == "true"){
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'TripNotAdded'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        } else {
          this.loading = false;
          this.dialogRef.close()
          const dialogConfig = new MatDialogConfig();
        //pass data to dialog
          dialogConfig.data = {
            hint: 'TripAdded'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
        })
    }
  }
  resetForm(){
    this.addMasterTrip.reset();
  }

  onNoClick() {
    this.dialogRef.close()
  }
  
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
