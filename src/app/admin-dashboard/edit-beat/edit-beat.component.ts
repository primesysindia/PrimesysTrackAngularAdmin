import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { KeyManBeatList, PostKeymanData } from '../../core/post';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/core/message.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { environment } from 'src/environments/environment';
import { LiveLocationService } from '../../services/live-location.service';

@Component({
  selector: 'app-edit-beat',
  templateUrl: './edit-beat.component.html',
  styleUrls: ['./edit-beat.component.css']
})
export class EditBeatComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  private ngUnsubscribe: Subject<any> = new Subject();
  beatData: any=[];
  updateKeymanForm: FormGroup;
  parentId: any;
  studentId: any;
  sectionN: any;
  postData: any;
  loading: boolean;
  beatId: any;
  section: any;
  hide: boolean = true;
  currUser: any;
  loginName: any;
  imeiNo: any;
  stdName: any;
  public event: EventEmitter<any> = new EventEmitter();
  
  constructor( public dialogRef: MatDialogRef<EditBeatComponent>,
    private beatService: BeatServiceService,
    private liveLocServ: LiveLocationService, 
    private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public keymanlist,
    public dialog: MatDialog) { 
      // console.log("data", this.keymanlist)
    }

  ngOnInit() {
    this.parentId = JSON.parse(localStorage.getItem('ParentId'));
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.loginName = this.currUser.userName;
    this.beatData = this.keymanlist.response[0];
    this.imeiNo = this.keymanlist.imei;
    this.stdName = this.keymanlist.devName;
    this.studentId = this.keymanlist.response[0].studentId;
    // console.log("section", this.beatData)
    this.updateKeymanForm = this.fb.group({
      kmStart: new FormControl(this.beatData.KmStart, Validators.required),
      kmEnd: new FormControl(this.beatData.KmEnd, Validators.required),
      sectionName: new FormControl(this.beatData.SectionName, Validators.required),
      kmStartLat: new FormControl(this.beatData.Start_Lat, Validators.required),
      kmStartLang: new FormControl(this.beatData.Start_Lon, Validators.required),
      kmEndLat: new FormControl(this.beatData.End_Lat, Validators.required),
      kmEndLang: new FormControl(this.beatData.End_Lon, Validators.required),
      startTime:  ['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      endTime:  ['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
    }); 
    this.initIoConnection();
    this.getSectionName()
  }

  private initIoConnection(): void{
    let webSocketUrl = 'ws://'+this.currUser.socketUrl+':'+environment.portNo+'/bullet';
    // let webSocketUrl = 'ws://123.252.246.214:8181/bullet';
    this.liveLocServ.initSocket(webSocketUrl);
  }

  public hasErrorInSetPeriod = (controlName: string, errorName: string) =>{
    return this.updateKeymanForm.controls[controlName].hasError(errorName);
  }

  updateKeymanBeat(){
    var data = 'PERIOD,1,1,0,' + this.updateKeymanForm.get('startTime').value + '-' + this.updateKeymanForm.get('endTime').value + '#'
    var data1 = 'PERIOD,1,1,1,' + this.updateKeymanForm.get('startTime').value + '-' + this.updateKeymanForm.get('endTime').value + '#'
    var data2 = 'PERIOD,1,1,2,' + this.updateKeymanForm.get('startTime').value + '-' + this.updateKeymanForm.get('endTime').value + '#'
    
    var dataArray = new Array(data, data1, data2); 
    if(this.updateKeymanForm.get('startTime').value && this.updateKeymanForm.get('endTime').value) {
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
      // console.log("input", inputData)
      this.liveLocServ.sendMsg(inputData)
    }
  }
    this.liveLocServ.messages.takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        // console.log(res)
      });

    if(this.updateKeymanForm.invalid)
      return
    else{
      this.loading = true;
      this.beatService.UpdateKeymanBeat(this.updateKeymanForm.value)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          // console.log("data", data)
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
            this.loading = false;
            this.dialogRef.close()
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'BeatUpdated'
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          // console.log("data approved", data)
  
        }
      })
        // .subscribe((data)=>{
        //   this.dialogRef.close();
        //   const dialogConfig = new MatDialogConfig();
        // //pass data to dialog
        //   dialogConfig.data = {
        //     hint: 'BeatUpdated'
        //   };
        //  const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        // })
    }
  }
  getSectionName() {
    this.loading = true;
    this.beatService.getSectionName(this.parentId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe(data => {
      this.loading = false;
      this.section = data
    })
  }

  resetForm(){
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  callSomeFunction() {
    this.hide = false;
  }

  onNoClick() {
    this.dialogRef.close()
  }
}
