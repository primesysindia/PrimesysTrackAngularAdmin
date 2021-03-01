import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output ,AfterViewInit,  OnDestroy } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserDataService } from '../../services/user-data.service';
import { ParentUserList } from '../../core/post';
import { GetDeviceService } from '../../services/get-device.service';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { MatDialog, MatDialogConfig, MatRadioChange } from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { onMainContentChange } from '../../core/animation';
import { SidenavService } from '../../services/sidenav.service';
import { LiveLocationService } from '../../services/live-location.service';
import { WebsocketService } from '../../services/websocket.service';
import { User } from '../../core/user.model';
import { BeatServiceService } from '../../services/beat-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-device-diagnose',
  templateUrl: './device-diagnose.component.html',
  styleUrls: ['./device-diagnose.component.css'],
  animations: [ onMainContentChange ]
})
export class DeviceDiagnoseComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
 
  devDiagnoseForm: FormGroup; 
  post: any;
  loading: boolean;
  devList: Array<DevicesInfo>;
  devicesListss: Array<DevicesInfo>;
  showID: boolean= false;
  isDevice: boolean = false;
  checkAllDevices: boolean = false;
  showAllFields: boolean = false;
  parentId: any;
  parentData: any;
  parentList:Array<ParentUserList>;
  data: any;
  parentsLists: any;
  parentDataList: any;
  allPosts: any;
  parentlist = new FormControl();
  autoCompleteList: any[]
  imeiNo: any;
  currUser: User;
  value: any;
  commandData: any;
  showInput: boolean = false;
  deviceData: any[];
  deviceName: any;
  response: any = [];
  options: any = [];
  stud_id: any;
  imei_no: any;
  responseData: any = [];
  showTable: boolean = false;
  myArr: any =[]
  studentId: any;
  studentName: any;
  students_id: any = [];
  title: any;
  receivedValues: any;
  showCommand: boolean = false;
  staticValue: any;
  loginName: any;

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  change: EventEmitter<MatRadioChange> 
  public onSideNavChange: boolean;

  public deviceFilterCtrl: FormControl = new FormControl();
  public filteredDevices: ReplaySubject<DevicesInfo[]> = new ReplaySubject<DevicesInfo[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor(private dataService: UserDataService, 
    private getDevice: GetDeviceService,
    public dialog: MatDialog,
    private _sidenavService: SidenavService,
    private liveLocServ: LiveLocationService, 
    public fb: FormBuilder, 
    private wsServ: WebsocketService,
    private getCommand: BeatServiceService,
    ) { 
      this._sidenavService.sideNavState$.subscribe( res => {
      this.onSideNavChange = res;
    })}

  ngOnInit() {
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.loginName = this.currUser.userName;
    this.devDiagnoseForm = this.fb.group({
      parentlist: [''],
      // commands: [''],
      inputCommand: [''],
      // devlists: new FormArray([]),
    })
    this.getParentData();
    this.initIoConnection();

  }

  // intitialize socket connection
  private initIoConnection(): void{
    let webSocketUrl = 'ws://'+this.currUser.socketUrl+':'+environment.portNo+'/bullet';
    this.liveLocServ.initSocket(webSocketUrl);
  }

  // get parent user list
  getParentData() {
    this.loading = true;
    this.dataService.getAllParentId()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data: any) => {
      if(data.length == 0){
        // this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'NoParentList'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
      else {
        this.allPosts = data;
        this.dataService.ParentData = data;
        // this.getCommandsList();

        this.parentlist.valueChanges.subscribe(userInput => {
          this.autoCompleteExpenseList(userInput);
        })
      } 
      this.loading = false;
    },
      (error: any) => { 
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'ServerError'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
    )
  }

  private autoCompleteExpenseList(input) {
    let categoryList = this.filterCategoryList(input)
    this.autoCompleteList = categoryList;
  }

  filterCategoryList(val) {
    var categoryList = []
    if (typeof val != "string") {
      return [];
    }
    if (val === '' || val === null) {
      return this.allPosts;
    }
    return val 
    ? this.allPosts.filter(element => element.Name && element.Name.toLowerCase().indexOf(val.toString().toLowerCase()) != -1) 
    : this.allPosts;
   
  }

  displayFn(post: ParentUserList) {
    let k = post ? post.Name : post;
    return k;
  }

  filterPostList(event) {
    this.devList = []
    var posts= event.source.value;
        if(!posts) {
          this.dataService.searchOption=[]
        }
        else {
            this.dataService.searchOption.push(posts);
            this.onSelectedOption.emit(this.dataService.searchOption)
        }
       
        this.focusOnPlaceInput();
  }

  // remove parent name from text field
  removeOption(option) {
    this.devList = [];
    this.showAllFields = false;
    let index = this.dataService.searchOption.indexOf(option);
    if (index >= 0)
        this.dataService.searchOption.splice(index, 1);
        this.focusOnPlaceInput();
        this.onSelectedOption.emit(this.dataService.searchOption)
  }

  focusOnPlaceInput() {
    this.autocompleteInput.nativeElement.focus();
    this.autocompleteInput.nativeElement.value = '';
  }

  // get parent data on option click
  optionClicked(event: Event, user: ParentUserList) {
    this.getDevices( user.parentId);
    localStorage.setItem('ParentId', JSON.stringify(user.parentId));
  }

  // get devices/students list
  getDevices(pid){
    this.loading = true;
    this.getDevice.getAllDeviceList(pid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: Array<DevicesInfo>) => {
       
        if(data.length == 0){
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'NoDeviceList'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
        else{
          localStorage.setItem('devicesListss',JSON.stringify(data))
          this.devicesListss = JSON.parse(localStorage.getItem('devicesListss'))
          this.devList = this.devicesListss;
          this.showAllFields = true;
          this.deviceFilter();
          }
          this.loading = false;
        },
        (error: any) => { 
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'ServerError'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
      )
    }

  deviceFilter() {
    // load the initial device list
    this.filteredDevices.next(this.devList);
    // console.log("filteredlist", this.filteredDevices);

    // listen for search field value changes
    this.deviceFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterdevLists();
      });
  }
  
  protected filterdevLists() {
    if (!this.devList) {
      return;
    }
    // get the search keyword
    let search = this.deviceFilterCtrl.value;
    if (!search) {
      this.filteredDevices.next(this.devList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the devices
    this.filteredDevices.next(
      this.devList.filter(device => device.name.toLowerCase().indexOf(search) > -1)
    );
  }

  student: any;
  simNo: any;
  onSelection(event: Event, student) {
    this.student = student.student_id;
    this.imeiNo = student.imei_no;
    this.simNo = student.simNo; 
    this.deviceName = student.name;
      localStorage.setItem('StudentID', this.student);
      
      let input = {
        "event":"start_track",
        "student_id": +this.student
      }
      // console.log("inp", input)
      this.liveLocServ.sendMsg(input);
  }
  
  finalMsg: any;
  respMsg: any = [];
  cmdSuccessMsg: any;
  deviceResponseMsg: any;
   
  submit(formData) {
      var commands =  this.devDiagnoseForm.get('inputCommand').value;
      this.deviceData = this.deviceName;
        var inputData =  {
        "event":"send_command",
        "student_id": +this.student,
        "data":{
          "command": commands,
          "device":this.imeiNo,
          "deviceName": this.deviceData,
          "loginName": this.loginName
        }
      };
      // console.log("input data", inputData);
      this.liveLocServ.sendMsg(inputData)
      this.loading = true;
      this.liveLocServ.messages.takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        this.loading = false;
        this.response.push(res);
        for(var j =0; j< this.response.length;j++) {
            this.showTable = true
            this.responseData = JSON.parse(this.response[j].data);
            // console.log("response", this.responseData)
            this.students_id = this.responseData.studentId;
            
            if(this.responseData.event == 'send_command_status') {
              this.responseData = JSON.parse(this.response[j].data);
              this.cmdSuccessMsg = this.responseData.msg;
              // console.log("cmdSuccessMsg", this.cmdSuccessMsg)
            }
            else if(this.responseData.event == 'send_command_device_response') {
              this.responseData = JSON.parse(this.response[j].data);
              this.deviceResponseMsg = this.responseData.msg;
              // console.log("deviceResponseMsg", this.deviceResponseMsg)
            }
            else {
              this.responseData = JSON.parse(this.response[j].data);
              this.finalMsg = this.responseData;
              this.respMsg.push(this.finalMsg);
              // console.log("finalmsg", this.respMsg)
            }
        } 
        this.myArr.push(this.responseData);
      })
  }

  reset() {
    this.devDiagnoseForm.reset()
  }

    ngOnDestroy(): void{
      let input =  {
        "event":"stop_track"
      };
      this.liveLocServ.sendMsg(input);
      this.wsServ.closeConnection()
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
      localStorage.removeItem('deviceData')
    }


}
