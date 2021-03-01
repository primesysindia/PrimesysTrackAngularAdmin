import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PetrolmanBeatList } from '../../core/post';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { Message } from 'src/app/core/message.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { environment } from 'src/environments/environment';
import { LiveLocationService } from '../../services/live-location.service';

@Component({
  selector: 'app-edit-patrolman-beat',
  templateUrl: './edit-patrolman-beat.component.html',
  styleUrls: ['./edit-patrolman-beat.component.css']
})
export class EditPatrolmanBeatComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  beatData: any=[];
  editBeatForm: FormGroup;
  parentId: any;
  studentId: any;
  section: any;
  tripData: any;
  totalKmCover: number;
  loading: boolean;
  currUser: any;
  loginName: any;
  imeiNo: any;
  stdName: any;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<EditPatrolmanBeatComponent>,
    @Inject(MAT_DIALOG_DATA) public petrolmanlist,
    private beatService: BeatServiceService, 
    private liveLocServ: LiveLocationService, 
    public dialog: MatDialog,
    private fb: FormBuilder) { }

    ngOnInit() {
      this.parentId = JSON.parse(localStorage.getItem('ParentId')),
      // this.studentId = localStorage.getItem('StudentID'),
      this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
      this.loginName = this.currUser.userName;
      this.beatData = this.petrolmanlist.response[0];;
      // this.beatData = this.petrolmanlist.
      this.imeiNo = this.petrolmanlist.imei;
      this.stdName = this.petrolmanlist.devName;
      this.studentId = this.petrolmanlist.response[0].studentId;
      // console.log("this.beatData", this.beatData)

      // console.log("this.ssmvhfdv",this.beatData[0].sectionName)

      this.editBeatForm = this.fb.group({
        'kmStart':new FormControl(this.beatData.kmStart, Validators.required),
        'kmEnd': new FormControl(this.beatData.kmEnd, Validators.required),
        'sectionName': new FormControl(this.beatData.sectionName, Validators.required),
        'seasonId': new FormControl(this.beatData.seasonId, Validators.required),
        'fk_TripMasterId': new FormControl(this.beatData.fk_TripMasterId, Validators.required),
        'startTime': ['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
        'endTime': ['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
        'startTime2': ['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
        'endTime2': ['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      })
      this.initIoConnection();
      // this.GetRailwayPetrolmanTripsMaster();
      this.getSectionName();
      // console.log("thid", this.editBeatForm.value);
    }

    private initIoConnection(): void{
      let webSocketUrl = 'ws://'+this.currUser.socketUrl+':'+environment.portNo+'/bullet';
      // let webSocketUrl = 'ws://123.252.246.214:8181/bullet';
      this.liveLocServ.initSocket(webSocketUrl);
    }

    public hasErrorInSetPeriod = (controlName: string, errorName: string) =>{
      return this.editBeatForm.controls[controlName].hasError(errorName);
    }

    getSectionName() {
      this.loading = true;
      this.beatService.getSectionName(this.parentId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => {
        this.loading = false;
        this.section = data
        // console.log("section", this.section)
        this.GetRailwayPetrolmanTripsMaster();
      })
      
    }
  
    GetRailwayPetrolmanTripsMaster() {
      this.loading = true;
      this.beatService.GetRailwayPetrolmanTripsMaster(this.parentId).subscribe(data => {
        this.loading = false; 
        this.tripData = data;
        // console.log("this.tripData", this.tripData)
      })
    }

    updateBeat(){
      var data1 = 'PERIOD,1,1,0,' + this.editBeatForm.get('startTime').value + '-' + this.editBeatForm.get('endTime').value + '#'
      var data2 = 'PERIOD,1,1,1,' + this.editBeatForm.get('startTime').value + '-' + this.editBeatForm.get('endTime').value + '#'
      var data3 = 'PERIOD,1,1,2,' + this.editBeatForm.get('startTime').value + '-' + this.editBeatForm.get('endTime').value + '#'
      
      var secData1 = 'PERIOD,1,1,0,' + this.editBeatForm.get('startTime').value + '-' + this.editBeatForm.get('endTime').value + ',' 
      + this.editBeatForm.get('startTime2').value + '-' + this.editBeatForm.get('endTime2').value + '#'
      
      var secData2 = 'PERIOD,1,1,1,' + this.editBeatForm.get('startTime').value + '-' + this.editBeatForm.get('endTime').value + ',' 
      + this.editBeatForm.get('startTime2').value + '-' + this.editBeatForm.get('endTime2').value + '#'

      var secData3 = 'PERIOD,1,1,2,' + this.editBeatForm.get('startTime').value + '-' + this.editBeatForm.get('endTime').value + ',' 
      + this.editBeatForm.get('startTime2').value + '-' + this.editBeatForm.get('endTime2').value + '#'

      if(this.editBeatForm.get('startTime').value && this.editBeatForm.get('endTime').value && this.editBeatForm.get('startTime2').value && this.editBeatForm.get('endTime2').value) {
        var secDataArray = new Array(secData1, secData2, secData3); 
        // console.log("sec data", secDataArray);
        for(var i=0; i < secDataArray.length; i++) {
          var inputData =  {
            "event":"send_command",
            "student_id": +this.studentId,
            "data":{
              "command": secDataArray[i],
              "device": this.imeiNo,
              "deviceName": this.stdName,
              "loginName": this.loginName
            }
          };
          // console.log("input", inputData)
          this.liveLocServ.sendMsg(inputData)
        }
      }
      else if(this.editBeatForm.get('startTime').value && this.editBeatForm.get('endTime').value) {
        var dataArray = new Array(data1, data2, data3); 
        for(var i=0; i < dataArray.length; i++) {
          var inputData =  {
            "event":"send_command",
            "student_id": +this.studentId,
            "data":{
              "command": dataArray[i],
              "device": this.imeiNo,
              "deviceName": this.stdName,
              "loginName": this.loginName
            }
          };
          // console.log("else input", inputData)
          this.liveLocServ.sendMsg(inputData)
        }
      }
  
      this.liveLocServ.messages.takeUntil(this.ngUnsubscribe)
        .subscribe(res => {
          // console.log(res)
      });
      if(this.editBeatForm.invalid)
        return
      else{ 
        let totalKmCover =  {
          "totalKmCover" : this.editBeatForm.value.kmEnd - this.editBeatForm.value.kmStart,
          "stdId": this.studentId
        }
        this.loading = true;
        this.beatService.UpdatePatrolManBeat(Object.assign(totalKmCover, this.editBeatForm.value))
          .takeUntil(this.ngUnsubscribe)
          .subscribe((data: Message)=>{
            if(data.error == "true"){
              this.loading = false;
              this.dialogRef.close();
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'BeatNotUpdated'
              };
              const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
            } else {
              this.dialogRef.close();
              this.loading = false;
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'BeatUpdated'
              };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
    
          }
        })
      }
    }

    onNoClick() {
      this.dialogRef.close()
    }

    reset() {
      this.editBeatForm.reset();
    }
}
