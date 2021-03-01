import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { KeyManBeatList } from '../../core/post';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { Message } from 'src/app/core/message.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { environment } from 'src/environments/environment';
import { LiveLocationService } from '../../services/live-location.service';

@Component({
  selector: 'app-add-beat-form',
  templateUrl: './add-beat-form.component.html',
  styleUrls: ['./add-beat-form.component.css']
})
export class AddBeatFormComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  beatData: Array<KeyManBeatList>;
  addKeymanForm: FormGroup;
  parentId: any;
  studentId: any;
  section: any;
  postData: any;
  loading: boolean = false;
  devicesList: any;
  sId :any;
  imeiNo: any;
  stdName: any;
  pId: any;
  currUser: any;
  loginName: any;
  public event: EventEmitter<any> = new EventEmitter();
  
  constructor(private beatService: BeatServiceService, 
    public dialog: MatDialog, private fb: FormBuilder,
    private liveLocServ: LiveLocationService, 
    public dialogRef: MatDialogRef<AddBeatFormComponent>,
    @Inject(MAT_DIALOG_DATA) data        
    ) {
      this.sId = data.stdId; 
      this.imeiNo = data.imei;
      this.stdName = data.devName;
      this.pId = data.pId;
    }

  ngOnInit() {
    this.parentId = JSON.parse(localStorage.getItem('ParentId')),
    this.studentId = localStorage.getItem('StudentID'), 
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.loginName = this.currUser.userName;
    this.addKeymanForm = this.fb.group({
      'kmStart': ['', Validators.required],
      'kmEnd': ['', Validators.required],
      'sectionName': ['', Validators.required],
      'kmStartLat': ['', Validators.required],
      'kmStartLang': ['', Validators.required],
      'kmEndLat': ['', Validators.required],
      'kmEndLang': ['', Validators.required],
      'startTime': ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      'endTime': ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      'startTime2': ['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      'endTime2': ['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
    })
    this.initIoConnection();
  }
  // intitialize socket connection
  private initIoConnection(): void{
    let webSocketUrl = 'ws://'+this.currUser.socketUrl+':'+environment.portNo+'/bullet';
    // let webSocketUrl = 'ws://123.252.246.214:8181/bullet';
    this.liveLocServ.initSocket(webSocketUrl);
    this.getSectionName();
  }

  public hasErrorInSetPeriod = (controlName: string, errorName: string) =>{
    return this.addKeymanForm.controls[controlName].hasError(errorName);
  }

  // get section name
  getSectionName() {
    this.loading = true;
    this.beatService.getSectionName(this.parentId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe(data => {
      this.loading = false;
      this.section = data
    })
  }
  get f() { return this.addKeymanForm.controls; }

 
  addKeymanBeat(){
    var data1 = 'PERIOD,1,1,0,' + this.addKeymanForm.get('startTime').value + '-' + this.addKeymanForm.get('endTime').value + '#'
    var data2 = 'PERIOD,1,1,1,' + this.addKeymanForm.get('startTime').value + '-' + this.addKeymanForm.get('endTime').value + '#'
    var data3 = 'PERIOD,1,1,2,' + this.addKeymanForm.get('startTime').value + '-' + this.addKeymanForm.get('endTime').value + '#'
    
    var secData1 = 'PERIOD,1,1,0,' + this.addKeymanForm.get('startTime').value + '-' + this.addKeymanForm.get('endTime').value + ',' 
    + this.addKeymanForm.get('startTime2').value + '-' + this.addKeymanForm.get('endTime2').value + '#'
    
    var secData2 = 'PERIOD,1,1,1,' + this.addKeymanForm.get('startTime').value + '-' + this.addKeymanForm.get('endTime').value + ',' 
    + this.addKeymanForm.get('startTime2').value + '-' + this.addKeymanForm.get('endTime2').value + '#'

    var secData3 = 'PERIOD,1,1,2,' + this.addKeymanForm.get('startTime').value + '-' + this.addKeymanForm.get('endTime').value + ',' 
    + this.addKeymanForm.get('startTime2').value + '-' + this.addKeymanForm.get('endTime2').value + '#'


    // var dataArray = new Array(data, data1, data2); 
    // if (this.addKeymanForm.get('startTime').value && this.addKeymanForm.get('endTime').value) {
    // for(var i=0; i < dataArray.length; i++) {
    //   var inputData =  {
    //     "event":"send_command",
    //     "student_id": +this.studentId,
    //     "data":{
    //       "command": dataArray[i],
    //       "device": this.imeiNo,
    //       "deviceName": this.stdName,
    //       "loginName": this.loginName
    //     }
    //   };
    //   // console.log("input", inputData)
    //   this.liveLocServ.sendMsg(inputData)
    // }
    //   this.liveLocServ.messages.takeUntil(this.ngUnsubscribe)
    //     .subscribe(res => {
    //       // console.log(res)
    //   });
    // }

    if(this.addKeymanForm.get('startTime').value && this.addKeymanForm.get('endTime').value && this.addKeymanForm.get('startTime2').value && this.addKeymanForm.get('endTime2').value) {
      var secDataArray = new Array(secData1, secData2, secData3); 
      // console.log("sec data", secDataArray);
      for(var i=0; i < secDataArray.length; i++) {
        var inputData =  {
          "event":"send_command",
          "student_id": +this.sId,
          "data":{
            "command": secDataArray[i],
            "device": this.imeiNo,
            "deviceName": this.stdName,
            "loginName": this.loginName
          }
        };
        // console.log(inputData)
        this.liveLocServ.sendMsg(inputData)
      }
    }
    else if(this.addKeymanForm.get('startTime').value && this.addKeymanForm.get('endTime').value) {
      var dataArray = new Array(data1, data2, data3); 
      for(var i=0; i < dataArray.length; i++) {
        var inputData =  {
          "event":"send_command",
          "student_id": +this.sId,
          "data":{
            "command": dataArray[i],
            "device": this.imeiNo,
            "deviceName": this.stdName,
            "loginName": this.loginName
          }
        };
        this.liveLocServ.sendMsg(inputData)
      }
    }
    this.liveLocServ.messages.takeUntil(this.ngUnsubscribe)
    .subscribe(res => {
      console.log("res", res);
    });
    // console.log("form", this.addKeymanForm.value);
    if(this.addKeymanForm.invalid)
      return
    else{
      this.loading = true;

      this.beatService.SaveKeymanBeat(this.addKeymanForm.value)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          // console.log("data", data)
          if(data.error == "true"){
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'BeatNotAdded'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          } else {
            this.loading = false;
            this.dialogRef.close()
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'BeatAdded'
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
        })
    }
  }

  resetForm(){
    this.addKeymanForm.reset();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onNoClick() {
    this.dialogRef.close()
  }
}
