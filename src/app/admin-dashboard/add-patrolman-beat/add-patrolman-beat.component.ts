import { Component, ViewChild, ElementRef, EventEmitter,Output, AfterViewInit, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PetrolmanBeatList } from '../../core/post';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BeatServiceService } from '../../services/beat-service.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { Message } from 'src/app/core/message.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { GetTripMaster } from '../../core/post';
import { environment } from 'src/environments/environment';
import { LiveLocationService } from '../../services/live-location.service';

@Component({
  selector: 'app-add-patrolman-beat',
  templateUrl: './add-patrolman-beat.component.html',
  styleUrls: ['./add-patrolman-beat.component.css']
})
export class AddPatrolmanBeatComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  tripFilterCtrl: FormControl = new FormControl();
  /** list of devices filtered by search keyword */
  public filteredTripList: ReplaySubject<GetTripMaster[]> = new ReplaySubject<GetTripMaster[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  beatData: Array<PetrolmanBeatList>;
  addBeatForm: FormGroup;
  parentId: any;
  studentId: any;
  section: any;
  tripData: any;
  totalKmCover: number;
  loading: boolean = false;
  currUser: any;
  loginName: boolean = false;
  sId :any;
  imeiNo: any;
  stdName: any;
  pId: any;

  // public tripsInfo: FormArray;
  public tripList: FormArray;
  public event: EventEmitter<any> = new EventEmitter();

  
  constructor(
    // @Inject(MAT_DIALOG_DATA) public mdata: any,
    private beatService: BeatServiceService,
     public dialog: MatDialog,
     private liveLocServ: LiveLocationService, 
     
     private fb: FormBuilder, 
     public dialogRef: MatDialogRef<AddPatrolmanBeatComponent>,
     @Inject(MAT_DIALOG_DATA) data        
     ) {
       this.sId = data.stdId; 
       this.imeiNo = data.imei;
       this.stdName = data.devName;
       this.pId = data.pId;
       let input = {
        "event":"stop_track"
      }
      this.liveLocServ.sendMsg(input);
      //  console.log(data);
     }
    
    get tripFormGroup() {
      return this.addBeatForm.get('tripsInfo') as FormArray;
    }
  
  ngOnInit() {
    let input = {
      "event":"start_track",
      "student_id": +this.sId
    }
    // console.log("start track", input)
    this.liveLocServ.sendMsg(input);
    this.parentId = JSON.parse(localStorage.getItem('ParentId')),
    this.studentId = localStorage.getItem('StudentID'),
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.loginName = this.currUser.userName;

    this.addBeatForm = this.fb.group({
      'sectionName': ['', Validators.required],
      'seasonId': ['', Validators.required],
      'startTime': ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      'endTime': ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      'startTime2': ['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      'endTime2': ['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      tripsInfo: this.fb.array([this.createTrip()])
    })

    this.tripList = this.addBeatForm.get('tripsInfo') as FormArray;
    this.initIoConnection();
    
  }
  // intitialize socket connection
  private initIoConnection(): void{
    let webSocketUrl = 'ws://'+this.currUser.socketUrl+':'+environment.portNo+'/bullet';
    // let webSocketUrl = 'ws://123.252.246.214:8181/bullet';
    this.liveLocServ.initSocket(webSocketUrl);
    this.getSectionName();
  }

  createTrip(): FormGroup {
    return this.fb.group({
      'kmStart': ['', [Validators.required]],
      'kmEnd': ['', Validators.required],
      'fk_TripMasterId': ['', Validators.required]
    });
  }

  addTrip() {
    this.tripList.push(this.createTrip());
  }

  // remove trip from group
  removeTrip(index) {
    if(index > 0) {
    this.tripList.removeAt(index);

    }
  }

  getTripsFormGroup(index): FormGroup {
    const formGroup = this.tripList.controls[index] as FormGroup;
    return formGroup;
  }

  getSectionName() {
    this.loading = true;
    this.beatService.getSectionName(this.parentId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe(data => {
      this.loading = false;
      this.section = data;
      this.GetRailwayPetrolmanTripsMaster();
    })
    this.loading = false;
  }

  GetRailwayPetrolmanTripsMaster() {
    this.arrayList = [];
    this.loading = true;
    this.beatService.GetRailwayPetrolmanTripsMaster(this.parentId).subscribe(data => {
      this.loading = false;
      this.tripData = data;
      this.tripFilter();
      // console.log("this.tripData", this.tripData )
    })  
    this.loading = false;
  }

  arrayList: any=[]
  onSelection(event, option) {
    if(event.isUserInput) {
      this.arrayList.push(option.tripTimeShedule);
    }
  }

  tripFilter() {
    // load the initial device list
    this.filteredTripList.next(this.tripData);
    // listen for search field value changes
    this.tripFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterdevLists();
      });
  }

  protected filterdevLists() {
    if (!this.tripData) {
      return;
    }
    // get the search keyword
    let search = this.tripFilterCtrl.value;
    if (!search) {
      this.filteredTripList.next(this.tripData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the devices
    this.filteredTripList.next(
      this.tripData.filter(device => device.tripName.toLowerCase().indexOf(search) > -1)
    );
  }

  get f() { return this.addBeatForm.controls; }

  public hasErrorInSetPeriod = (controlName: string, errorName: string) =>{
    return this.addBeatForm.controls[controlName].hasError(errorName);
  }

  saveBeat(){
    var data1 = 'PERIOD,1,1,0,' + this.addBeatForm.get('startTime').value + '-' + this.addBeatForm.get('endTime').value + '#'
    var data2 = 'PERIOD,1,1,1,' + this.addBeatForm.get('startTime').value + '-' + this.addBeatForm.get('endTime').value + '#'
    var data3 = 'PERIOD,1,1,2,' + this.addBeatForm.get('startTime').value + '-' + this.addBeatForm.get('endTime').value + '#'
    
    var secData1 = 'PERIOD,1,1,0,' + this.addBeatForm.get('startTime').value + '-' + this.addBeatForm.get('endTime').value + ',' 
    + this.addBeatForm.get('startTime2').value + '-' + this.addBeatForm.get('endTime2').value + '#'
    
    var secData2 = 'PERIOD,1,1,1,' + this.addBeatForm.get('startTime').value + '-' + this.addBeatForm.get('endTime').value + ',' 
    + this.addBeatForm.get('startTime2').value + '-' + this.addBeatForm.get('endTime2').value + '#'

    var secData3 = 'PERIOD,1,1,2,' + this.addBeatForm.get('startTime').value + '-' + this.addBeatForm.get('endTime').value + ',' 
    + this.addBeatForm.get('startTime2').value + '-' + this.addBeatForm.get('endTime2').value + '#'


    if(this.addBeatForm.get('startTime').value && this.addBeatForm.get('endTime').value && this.addBeatForm.get('startTime2').value && this.addBeatForm.get('endTime2').value) {
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
    else if(this.addBeatForm.get('startTime').value && this.addBeatForm.get('endTime').value) {
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
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    let studentId = JSON.parse(localStorage.getItem('StudentID'))
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;
    var season = this.addBeatForm.get('seasonId').value;
    // console.log("this.addBeatForm.value", this.addBeatForm.value)
    if(this.addBeatForm.invalid) {
      return
    }
    else{
      let params =  {
        userLoginId : userLoginId,
        studentId : this.sId
      }
      // console.log("params", params)
      let req = JSON.stringify(Object.assign(params, this.addBeatForm.value))
      // console.log("res", req)
      this.loading = true;
      this.beatService.SavePetrolmanBeat(req).takeUntil(this.ngUnsubscribe)
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
      // .subscribe((data)=>{
      //     console.log("data", data)
      //     this.dialogRef.close()
      //     const dialogConfig = new MatDialogConfig();
      //   //pass data to dialog
      //     dialogConfig.data = {
      //       hint: 'BeatAdded'
      //     };
      //    const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      //   })
    }
  }

  resetForm(){
    this.addBeatForm.reset();
  }

  onNoClick() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    // let input = {
    //   "event":"stop_track"
    // }
    // this.liveLocServ.sendMsg(input);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
