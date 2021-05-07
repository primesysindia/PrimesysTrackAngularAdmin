import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { ParentUserList } from '../../core/post';
import { GetDeviceService } from '../../services/get-device.service';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogConfig, MatRadioChange, MatTableDataSource } from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { onMainContentChange } from '../../core/animation';
import { SidenavService } from '../../services/sidenav.service';
import { LiveLocationService } from '../../services/live-location.service';
import { WebsocketService } from '../../services/websocket.service';
import { User } from '../../core/user.model';
import { BeatServiceService } from '../../services/beat-service.service';
import { CustomCommandModuleComponent } from '../custom-command-module/custom-command-module.component';
import { CommandHistoryComponent } from '../command-history/command-history.component';
import { environment } from 'src/environments/environment';
import { commandHistory } from '../../core/post';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FilterDevicesPipe } from '../../filters/filter-devices.pipe';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Rx';

export interface resultData{
  device: number;
  msg:string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  animations: [ onMainContentChange ],
  providers: [FilterDevicesPipe, DatePipe]
})
export class AdminDashboardComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  todayStartDate = new Date();
  adminForm: FormGroup;
  post: any;
  loading: boolean;
  results: Array<resultData>
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
  tableHeader: Array<string> = ['name','deviceId','command','commandDeliveredMsg','deviceCommandResponse','timestamp', 'login_name', 'resend'];
  dataSource: MatTableDataSource<commandHistory>;
  showCheckboxError: boolean;
  showRadioBtnError: boolean;
  sortType: any = ['All', 'On', 'Off', 'Keyman', 'Patrolman'];
  showOnDevices: boolean = false;
  showAllDevices: boolean = true;
  public selectedValue: string;
  selected: any = [];
  allDevices: any = []
  delCheckboxes: any[];
  allDeviceFilter: any;
  filterTypeName: any;
  allDevList: any;
  allSelected: any = [];
  showSearchDevices: boolean = false;
  finalArray: any;
  deviceNameValue: any;
  deviceNameSliced: any;
  fArray: any = [];
  periodString: any;
  
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  change: EventEmitter<MatRadioChange> 
  public onSideNavChange: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataService: UserDataService, 
    private getDevice: GetDeviceService,
    public dialog: MatDialog,
    private _sidenavService: SidenavService,
    private liveLocServ: LiveLocationService, 
    public fb: FormBuilder, 
    private wsServ: WebsocketService,
    private filterPipe: FilterDevicesPipe,
    private beatService: BeatServiceService,
    private datePipe: DatePipe
    ) { 
      this._sidenavService.sideNavState$.subscribe( res => {
      this.onSideNavChange = res;
    })}

  ngOnInit() {
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.loginName = this.currUser.userName;
    this.adminForm = this.fb.group({
      parentlist: [''],
      commands: ['',  Validators.required],
      inputCommand: [''],
      devlists: new FormArray([]),
      searchBox: [''],
    })
    this.getParentData();
    
  }

  // intitialize socket connection
  private initIoConnection(): void{
    let webSocketUrl = 'ws://'+this.currUser.socketUrl+':'+environment.portNo+'/bullet';
    // let webSocketUrl = 'ws://123.252.246.214:8181/bullet';
    this.liveLocServ.initSocket(webSocketUrl);
    this.getCommandsList();
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
        this.selected = [];
        this.devList = [];
        this.offDevicesArray = [];
        this.onDevicesArray = [];
        this.allPosts = data;
        this.dataService.ParentData = data;
        this.initIoConnection();

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
    this.devList = [];
    this.selected = [];
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
    this.selected = [];
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
    this.parentId = user.parentId;
    localStorage.setItem('ParentId', JSON.stringify(user.parentId));
  }

  // get devices/students list
  getDevices(pid){
    this.loading = true;
    this.beatService.getAllDevicesWithConnectedStatus(pid)
      // .takeUntil(this.ngUnsubscribe)
      .subscribe((data) => {
        // console.log("this.devList", data)
       
        if(data == 0){
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
          this.allDevList = this.devicesListss;
          this.devList = this.devicesListss;
          this.showCheckboxError = true;
          this.showAllFields = true;
          this.showAllDevices = true;
         
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

    filterType(mrChange: MatRadioChange){
      this.filterTypeName = mrChange.value;
      this.devList = this.filterPipe.transform(this.allDevList,this.filterTypeName)
    }


    getAllDevices() {
      this.showOnDevices = false;
      this.showAllDevices = true;
      this.showOffDevices = false;
      this.devicesListss = JSON.parse(localStorage.getItem('devicesListss'))
      this.devList = this.devicesListss;
      this.offDevicesArray = [];
      this.onDevicesArray = [];
      // console.log("dev", this.devList)// myItems is an array 
    }

    onDevicesArray: any;
    sortByTypeOnDevices() {
      this.showOnDevices = true;
      this.showAllDevices = false;
      this.showOffDevices = false;
      this.offDevicesArray = [];
      this.onDevicesArray = this.devList.filter(item => item.isConnected === true); 
    }

    offDevicesArray: any;
    showOffDevices: boolean = false;
    sortByTypeOffDevices() {
      this.showOnDevices = false;
      this.showAllDevices = false;
      this.showOffDevices = true;
      this.onDevicesArray = [];
      // this.devList = [];
      this.offDevicesArray = this.devList.filter(item => item.isConnected === false); 
    }

    keymanDevicesArray: any;
    sortDevicesByKeyman() {
      this.showOnDevices = false;
      this.showAllDevices = false;
      this.showOffDevices = true;
      this.keymanDevicesArray = this.devList.filter(value =>{
         value.name.startsWith('K/') == true
      }); 
      // console.log("keyman", this.keymanDevicesArray)
    }

  // get commands list 
    getCommandsList() {
      this.loading=true;
      this.beatService.getDevicesCommand().subscribe(res =>{
        this.loading = false;
        this.commandData = res;
        this.showRadioBtnError = true;
        this.getCommandHistoryDetails();
      })
    }

  // refresh button to refresh table
    refreshBtn() {
      this.getCommandHistoryDetails();
    }

    // get command history details
    getCommandHistoryDetails() {
      var date = this.datePipe.transform(this.todayStartDate, 'yyyy-MM-dd 00:00');
      var date1 = this.todayStartDate.setSeconds(this.todayStartDate.getSeconds() + 300);
      let timeFormat = {
        sTime: new Date(date).getTime()/1000,
        eTime: Math.floor(new Date(date1).getTime()/1000)
       }
      this.loading = true;
      this.beatService.GetTodaysDevCmdHistory(timeFormat).subscribe((res: Array<commandHistory>)=> {
        if(res.length == 0){
          this.loading = false;
        } else {
          this.loading = false;
          this.data = res;
          // console.log("data", this.data)
          this.dataSource = new MatTableDataSource<commandHistory>(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }, (error: any) => {
        console.log("error", error);
        this.loading = false;
          const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'ServerError'
              };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      })
    }

    // get data from popup of custom command
    public receivedData(data: any) {
      this.receivedValues = data;
      this.periodString = data[0].startsWith("PERIOD")      
      this.showCommand = true;
      this.staticValue = '';

    }

    // On radio button click get its value 
    onItemChange(event, commands) {
      if(event) {
        this.showRadioBtnError = false;
      }
      this.value = commands.command;
      this.title = commands.title;
       const dialogConfig = new MatDialogConfig();
    
      if (this.title == 'Set Family No') {
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
            width: '350px',
            hint: 'SetFamilyNo',
            command: this.value
        };
        const dialogRef = this.dialog.open(CustomCommandModuleComponent, dialogConfig)  
        .afterClosed().subscribe(data => {
          if(data && data.action === 1) {
            this.receivedData(data.data);
          }
        });
      } 
      else if (this.title == 'Set GMT') {
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
            // width: '350px',
            hint: 'SetGMT',
            command: this.value
        };
        const dialogRef = this.dialog.open(CustomCommandModuleComponent, dialogConfig)  
        .afterClosed().subscribe(data => {
          if(data && data.action === 1) {
            this.receivedData(data.data);
          }
        });
      } 
      else if (this.title == 'Set SOS No') {
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
            // width: '350px',
            hint: 'SetSOS',
            command: this.value
        };
        const dialogRef = this.dialog.open(CustomCommandModuleComponent, dialogConfig)  
        .afterClosed().subscribe(data => {
          if(data && data.action === 1) {
            this.receivedData(data.data);
          }
        });
      } 
      else if (this.title == 'Set Period') {
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
            // width: '350px',
            hint: 'SetPeriod',
            command: this.value
        };
        const dialogRef = this.dialog.open(CustomCommandModuleComponent, dialogConfig)  
        .afterClosed().subscribe(data => {
          if(data && data.action === 1) {
            this.receivedData(data.data);
          }
        });
      }
      else if (this.title == 'Set Timer') {
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
            // width: '350px',
            hint: 'SetTimer',
            command: this.value
        };
        const dialogRef = this.dialog.open(CustomCommandModuleComponent, dialogConfig)  
        .afterClosed().subscribe(data => {
          if(data && data.action === 1) {
            this.receivedData(data.data);
          }
        });
      }
      else if (this.title == 'Set HBT') {
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
            // width: '350px',
            hint: 'SetHBT',
            command: this.value
        };
        const dialogRef = this.dialog.open(CustomCommandModuleComponent, dialogConfig)  
        .afterClosed().subscribe(data => {
          if(data && data.action === 1) {
            this.receivedData(data.data);
          }
        });
      }
      else if (this.title == 'Other') {
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
            // width: '350px',
            hint: 'other',
            command: this.value
        };
        const dialogRef = this.dialog.open(CustomCommandModuleComponent, dialogConfig)  
        .afterClosed().subscribe(data => {
          if(data && data.action === 1) {
            this.receivedData(data.data);
          }
        });     
     } 
     if (this.title == 'Power ON Alm') {
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.data = {
          width: '350px',
          hint: 'PowerOnAlm',
          command: this.value
      };
      const dialogRef = this.dialog.open(CustomCommandModuleComponent, dialogConfig)  
      .afterClosed().subscribe(data => {
        if(data && data.action === 1) {
          this.receivedData(data.data);
        }
      });
    } 
    if (this.title == 'Power OFF Alm') {
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.data = {
          width: '350px',
          hint: 'PowerOffAlm',
          command: this.value
      };
      const dialogRef = this.dialog.open(CustomCommandModuleComponent, dialogConfig)  
      .afterClosed().subscribe(data => {
        if(data && data.action === 1) {
          this.receivedData(data.data);
        }
      });
    }
    if (this.title == 'Low battery ON alarm') {
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.data = {
          width: '350px',
          hint: 'lowBatteryAlm',
          command: this.value
      };
      const dialogRef = this.dialog.open(CustomCommandModuleComponent, dialogConfig)  
      .afterClosed().subscribe(data => {
        if(data && data.action === 1) {
          this.receivedData(data.data);
        }
      });
    }
    if (this.title == 'SOS On/Off Alm') {
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.data = {
          width: '350px',
          hint: 'sosAlarm',
          command: this.value
      };
      const dialogRef = this.dialog.open(CustomCommandModuleComponent, dialogConfig)  
      .afterClosed().subscribe(data => {
        if(data && data.action === 1) {
          this.receivedData(data.data);
        }
      });
    } 
    if (this.title == 'SimCard Change On/Off Alm') {
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.data = {
          width: '350px',
          hint: 'simChangeAlm',
          command: this.value
      };
      const dialogRef = this.dialog.open(CustomCommandModuleComponent, dialogConfig)  
      .afterClosed().subscribe(data => {
        if(data && data.action === 1) {
          this.receivedData(data.data);
        }
      });
    }
    if (this.title == 'Set Period(Weekaly)') {
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.data = {
          width: '350px',
          hint: 'setWeeklyPeriod',
          command: this.value
      };
      const dialogRef = this.dialog.open(CustomCommandModuleComponent, dialogConfig)  
      .afterClosed().subscribe(data => {
        if(data && data.action === 1) {
          this.receivedData(data.data);
        }
      });
    }
    else {
      this.receivedValues = '';
      this.showCommand = true;
      this.staticValue = this.value;
      // console.log("static", this.staticValue);
    }
    }

    onCheckChange(ev, item){
      if(ev.target.checked){
        this.showCheckboxError = false;
        this.selected.push(item);
        
        this.allDevices = [];
        for(var i =0;i<this.selected.length;i++ ) {
          this.deviceData = this.selected[i].student_id;
          this.allDevices.push(this.deviceData)
          // console.log("devcie data", this.deviceData)

        }
      } 
      else {
        this.selected.splice(this.selected.indexOf(item), 1)
        // for (var i = 0; i < this.selected.length; i++) {
        //   console.log("coming in for loop")
        //   if (this.selected[i].student_id === item.student_id) {
        //     console.log("true", this.selected[i])
        //     var deleted = this.selected[i].name
        //     this.delCheckboxes = deleted.slice(-3);
        //     this.selected.splice(i--, 1);
        //   }
        // }
        // this.selected.push(this.delCheckboxes)

      }
    }

    uncheckAll(items) {
      if (this.devList.every(val => val.checked == true)) {
        this.devList.forEach(val => {
           val.checked = false;
          this.selected = []
          this.allDevices = [];
           })
           
          return items = []
      }
    }
   
    // check/uncheck all checkboxes
    CheckAllOptions(items) {
      if (this.devList.every(val => val.checked == true)) {
        this.devList.forEach(val => { val.checked = false })
        this.selected = []
        this.allDevices = [];
        return items = []
      }
      else {
        this.selected = []
        this.devList.forEach(val => { val.checked = true});
        this.selected = items;
        for(var i =0;i<this.selected.length;i++ ) {
          this.deviceData = this.selected[i].student_id;
          this.allDevices.push(this.deviceData)

        }
      }
    }
  
    submit() {
      // this.initIoConnection();
      this.loading = true;
      let inpData =  {
        "event":"start_track",
        "student_id": +this.selected[0].student_id
      };
      this.liveLocServ.sendMsg(inpData);
      if(this.adminForm.invalid) {
        this.showCheckboxError = true;
        return
      } 
      else if (this.receivedValues && this.periodString) {
        for(var i=0; i<this.selected.length;i++) {
          this.deviceData = this.selected[i].name;
          this.deviceName = this.deviceData.slice(-3);
        for (var j=0; j < 3;j++) {
          var inputData =  {
            "event":"send_command",
            "student_id": +this.selected[i].student_id,
            "data":{
              "command": this.receivedValues[j],
              "device": this.selected[i].imei_no,
              "deviceName": this.selected[i].name,
              "loginName": this.loginName,
              "parent_id": +this.parentId,
            }
          };
          this.liveLocServ.sendMsg(inputData)
          this.loading = true;
          this.liveLocServ.messages.takeUntil(this.ngUnsubscribe)
          .subscribe(res => {
            this.loading = false;
             this.getCommandHistoryDetails()
           })
           this.loading = false;
        }   
      }
    }
    else{
      var data = JSON.parse(localStorage.getItem('deviceData'))
      var commands =  this.adminForm.get('inputCommand').value;
      for(var i=0; i<this.selected.length;i++) {
        this.deviceData = this.selected[i].name;
        this.deviceName = this.deviceData.slice(-3);
        if(this.receivedValues && !this.periodString) {
          var inputData =  {
            "event":"send_command",
            "student_id": +this.selected[i].student_id,
            "data":{
              "command": this.receivedValues,
              "device": this.selected[i].imei_no,
              "deviceName": this.selected[i].name,
              "loginName": this.loginName,
              "parent_id": +this.parentId,
            }
          };
          // console.log("first condition", inputData);
        }

        
        else if(this.adminForm.get('inputCommand').value) {
            var inputData =  {
            "event":"send_command",
            "student_id": +this.selected[i].student_id,
            "data":{
              "command": commands,
              "device":this.selected[i].imei_no,
              "deviceName": this.selected[i].name,
              "loginName": this.loginName,
              "parent_id": +this.parentId,
            }
          };
          // console.log("second condition", inputData);
        }
        else {
          this.receivedValues = '';
          var inputData =  {
            "event":"send_command",
            "student_id": +this.selected[i].student_id,
            "data":{
              "command": this.value,
              "device":this.selected[i].imei_no,
              "deviceName": this.selected[i].name,
              "loginName": this.loginName,
              "parent_id": +this.parentId,
            }
          };
          // console.log("third condition", inputData);
        }
        // console.log("inputData", inputData)
        this.liveLocServ.sendMsg(inputData)
        this.loading = true;
      }
      this.loading = true;
      this.liveLocServ.messages.takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        if(!res) {
          // console.log("loop entering")
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'HierarchyNotUpdated'
          };
         } else {
        this.loading = false;
        // console.log("res",res)
         this.response.push(res);
         let input = {
          "event":"stop_track"
        };
        this.liveLocServ.sendMsg(input)
         this.getCommandHistoryDetails()
         for(var j =0; j< this.response.length;j++) {
            this.showTable = true
            this.responseData = JSON.parse(this.response[j].data);
            console.log("response", this.responseData)
            this.students_id = this.responseData.studentId;
            for(var i=0; i<this.options.length;i++) {
              this.deviceData = this.options[i].name;
              this.students_id = this.responseData.studentId;
              this.studentId = this.options[i].studentId;
            }
         } 
       
         this.myArr.push(this.responseData);
        }
       })
       this.loading = false;
      }
    }

    resendCommand(cmdId, row) {
      // console.log("cmdid", row)
      var inputData =  {
        "event":"send_command",
        "student_id": row.StudentId,
        "data":{
          "command": row.command,
          "device": row.deviceId,
          "deviceName": row.name,
          "loginName": row.login_name,
        }
      };
      // console.log("inputData", inputData)
      this.liveLocServ.sendMsg(inputData)
      this.liveLocServ.messages.takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        // console.log("response", res);
        
        this.getCommandHistoryDetails()
      })

    }

    reset() {
      this.adminForm.reset()
    }
   
    // searchSubmit() {
    //   this.showSearchDevices = true;
    //   this.showOnDevices = false;
    //   this.showOffDevices = false;
    //   this.showAllDevices = false; 
    //   var values = this.adminForm.get('searchBox').value;
    //   this.finalArray = values.split(',');
    //   this.fArray.push(this.finalArray);

    //   for(var x=0; x<this.finalArray.length;x++) {
    //     // console.log("values", this.finalArray);
    //       for(var p=0; p< this.devicesListss.length; p++) {
    //         this.deviceNameValue = this.devicesListss[p].name;
    //         this.deviceNameSliced = this.deviceNameValue.slice(-3);
    //        console.log("deviceNameValue", this.deviceNameSliced)
    //         if(this.finalArray[0] == this.deviceNameSliced[0]) {

    //           console.log("true value")
    //         }
    //       }
    //   }
      
     
    // }

    ngOnDestroy(): void{
      this.wsServ.closeConnection()
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
      localStorage.removeItem('deviceData')
    }
}
    
