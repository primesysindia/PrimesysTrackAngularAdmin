import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output, AfterViewInit,  OnDestroy  } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserDataService } from '../../services/user-data.service';
import { GetDeviceService } from '../../services/get-device.service';
import { BeatServiceService } from '../../services/beat-service.service';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { PetrolmanBeatList, ParentUserList} from '../../core/post';
import { FormControl} from '@angular/forms';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { AddPatmasterBeatComponent } from '../add-patmaster-beat/add-patmaster-beat.component';
import { AddPatrolmanBeatComponent } from '../add-patrolman-beat/add-patrolman-beat.component';
import { EditPatrolmanBeatComponent } from '../edit-patrolman-beat/edit-patrolman-beat.component';
import { onMainContentChange } from '../../core/animation';
import { SidenavService } from '../../services/sidenav.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ApprovePatrolmanComponent } from '../approve-patrolman/approve-patrolman.component';
import { environment } from 'src/environments/environment';
import { LiveLocationService } from '../../services/live-location.service';
import { DeleteBeatComponent } from '../../admin-dashboard/delete-beat/delete-beat.component';

@Component({
  selector: 'app-patrolman-details',
  templateUrl: './patrolman-details.component.html',
  styleUrls: ['./patrolman-details.component.css'],
  animations: [ onMainContentChange ]
})
export class PatrolmanDetailsComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

   deviceFilterCtrl: FormControl = new FormControl();
  /** list of devices filtered by search keyword */
  public filteredDevices: ReplaySubject<DevicesInfo[]> = new ReplaySubject<DevicesInfo[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  parentUser: any;
  parentList: ParentUserList[];
  filteredList: any;
  showSTudentList: boolean = false;
  loading: boolean= true;
  devList: Array<DevicesInfo>;
  devicesListss: Array<DevicesInfo>;
  showAddButton: boolean= false;
  isDevice: boolean = false;
  checkAllDevices: boolean = false;
  pId: any;
  tableHeader: Array<string> = ['sectionName', 'tripName', 'seasonId', 'kmFromTo', 'tripStartTime', 'tripEndTime', 'kmStart', 'kmEnd',  
    'totalKmCover', 'action', 'delete','status'];
  dataSource :any = [];
  beatData: MatTableDataSource<PetrolmanBeatList>;
  ParentId: any;
  StudentID: any;
  parentlist = new FormControl();
  allPosts: any;
  autoCompleteList: any[]
  bId: any = 0;
  result: boolean;
  showApprove: boolean;
  approved: boolean;
  deviceID: any;
  showMasterTripButton: boolean = false;
  sId :any;
  imeiNo: any;
  stdName: any;
  loginName: any;
  userInfo: any;
  responseData: any = [];
  message: any;
  device: any;
  name: any;
  std_id: any;
  showTable: any;
  secondMsg: any;
    
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  public onSideNavChange: boolean;
  constructor(private dataService: UserDataService, 
    private getDevice: GetDeviceService, 
    private beatService: BeatServiceService, private _sidenavService: SidenavService,
    private liveLocServ: LiveLocationService, 
    public dialog: MatDialog) { 
      this._sidenavService.sideNavState$.subscribe( res => {
        console.log(res)
        this.onSideNavChange = res;
      })
    }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.loginName = this.userInfo.userName;
      var roleId = this.userInfo.roleId;
      if(roleId == 4 || roleId == 20) {
        this.showApprove = true;
        this.approved = false;
      } else {
        this.showApprove = false;
        this.approved = true;

      }
      this.getParentData();
      this.initIoConnection();
  }
 // intitialize socket connection
  private initIoConnection(): void{
    let webSocketUrl = 'ws://'+this.userInfo.socketUrl+':'+environment.portNo+'/bullet';
    // let webSocketUrl = 'ws://123.252.246.214:8181/bullet';
    this.liveLocServ.initSocket(webSocketUrl);
  }

  getParentData() {
    this.loading = true;
    this.dataService.getAllParentId()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data: any) => {
      if(!data){
        this.loading = false;
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
        // console.log("this.parentUser", this.allPosts)
        // this.getDevices(this.pId)

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

  removeOption(option) {
    this.devList = [];
    this.dataSource =[];
    this.secondMsg = [];
    this.message = [];
    this.filteredDevices.next([]); 
    this.showAddButton = false;
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

  //call getDevices function on parent select
  optionClicked(event: Event, user: ParentUserList) {
    this.secondMsg = [];
    this.message = [];
    this.getDevices( user.parentId);
    this.showMasterTripButton = true;
    localStorage.setItem('ParentId', JSON.stringify(user.parentId));
  }

  //get student list
  getDevices(pId){
    this.devList = [];
    this.stdName = [];
    this.imeiNo = [];
    this.sId = [];
    this.loading = true;
    this.getDevice.getAllDeviceList(pId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: Array<DevicesInfo>) => {
      //  console.log("data", data)
        if(data.length == 0){
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'NoStudentList'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
        else{
          localStorage.setItem('devicesListss',JSON.stringify(data))
          this.devicesListss = JSON.parse(localStorage.getItem('devicesListss'))
          this.devList = this.devicesListss;
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

  // this function is called in getDevices function
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
    // After studentselect call getKeymanBeat API
    onSelection(devices) {
      // console.log(devices)
      this.dataSource = []; 
      this.secondMsg = [];
      this.message = [];
      this.showAddButton = true;
      this.sId = devices.student_id;
      this.imeiNo = devices.imei_no;
      this.stdName = devices.name;

      let input = {
        "event":"start_track",
        "student_id": +this.sId
      }
      // console.log("start track", input)
      this.liveLocServ.sendMsg(input);

      // if(event.isUserInput) {
      //   var dId = event.source.value;
        // localStorage.setItem('StudentID', dId);
        this.ParentId = JSON.parse(localStorage.getItem('ParentId'))

       
        //keymanexisting beat api call
        this.getPatrolmanExistingBeat(this.ParentId, this.sId, this.bId)
      // }
    }

    // get existing beat of patrolman devices
    getPatrolmanExistingBeat(p, s, b) {
      this.loading = true;
      this.beatService.getPatrolmanExistingBeat(p, s, b).subscribe((res: Array<PetrolmanBeatList>)=> {
        this.loading = false;
        if(res.length == 0){
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'BeatNotFound'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        } else {
          this.beatData = new MatTableDataSource<PetrolmanBeatList>(res);
          // console.log("response", res.deviceID)
          this.dataSource = this.beatData;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.deviceID = this.dataSource.data[0].deviceID
          // console.log("dataSource", this.deviceID)
        }
      },(err) => {
        this.loading = false;
          const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'ServerError'
              };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      })
    }

    // open dialog of add patrolman trip master
    openMasterDialog(): void {
      let dialogRef = this.dialog.open(AddPatmasterBeatComponent, {
        width: '600px',
      }).afterClosed().subscribe((result) => {
      })
    }
    
    // open dialog of add beat form
    openDialog(): void {
      var pId = JSON.parse(localStorage.getItem('ParentId'))
      // var stdId = JSON.parse(localStorage.getItem('StudentID'))
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.height= '400px';
      dialogConfig.data = {
          width: '450px',
          // height: '400px',
          pId: pId,
          stdId: this.sId,
          devName: this.stdName,
          imei: this.imeiNo,
      };

      let dialogRef = this.dialog.open(AddPatrolmanBeatComponent, dialogConfig)
      .afterClosed().subscribe((result) => {
        this.getPatrolmanExistingBeat(pId, this.sId,'0')
      })
    }

    // open dialog of edit beat form
    openEditDialog(beat): void {
      var pId = JSON.parse(localStorage.getItem('ParentId'))
      // var stdId = JSON.parse(localStorage.getItem('StudentID'))
      localStorage.setItem('beatId',JSON.stringify(beat))
      const dialogConfig = new MatDialogConfig();

      this.beatService.getPatrolmanExistingBeatById(pId, this.sId, beat).subscribe((res: Array<PetrolmanBeatList>)=> {
        dialogConfig.width = '600px';
        // dialogConfig.data = res;
        dialogConfig.data = {
          width: '450px',
          // height: '400px',
          pId: pId,
          stdId: this.sId,
          devName: this.stdName,
          imei: this.imeiNo,
          response: res
      };
        // console.log("id",dialogConfig.data)
  
        let dialogRef = this.dialog.open(EditPatrolmanBeatComponent, dialogConfig)
        .afterClosed().subscribe((result) => {
          this.getPatrolmanExistingBeat(pId, this.sId, beat);
        })
    })
    }

    // open dialog to approve beat
    confirmDialog(beat) {
      const message = 'Do you want to approve this?';
      // const dialogData = new ConfirmDialogModel("Please Confirm", message);
      const dialogConfig = new MatDialogConfig();
  
      localStorage.setItem('beatId',JSON.stringify(beat))
      var pId = JSON.parse(localStorage.getItem('ParentId'))
      // var stdId = JSON.parse(localStorage.getItem('StudentID'))
      this.beatService.getPatrolmanExistingBeatById(pId, this.sId, beat).subscribe((res: Array<PetrolmanBeatList>)=> {
        // dialogConfig.width = '600px';
        dialogConfig.data = res;
        dialogConfig.maxWidth= "400px";
  
        let dialogRef = this.dialog.open(ApprovePatrolmanComponent, dialogConfig)
    
       .afterClosed().subscribe(dialogResult => {
          this.result = dialogResult;
          this.getPatrolmanExistingBeat(pId, this.sId, beat);
        });
      })
    }

    sendCommand() {
      var inputData =  {
        "event":"send_command",
        "student_id": +this.sId,
        "data":{
          "command": 'period',
          "device": this.imeiNo,
          "deviceName": this.stdName,
          "loginName": this.loginName
        }
      };
      // console.log(inputData)

      this.liveLocServ.sendMsg(inputData);
      this.liveLocServ.messages.takeUntil(this.ngUnsubscribe)
        .subscribe(res => {
          // console.log(res)
          var response = res;
          this.showTable = true;
          this.responseData = JSON.parse(response.data);
          if(this.responseData.event == 'send_command_status') {
            this.message = this.responseData.msg;
            this.device = this.responseData.device;
            this.name = this.responseData.name;
            this.std_id = this.responseData.studentId;
            // console.log("res", this.responseData)
         } else if(this.responseData.event == 'send_command_device_response') {
           this.secondMsg = this.responseData.msg;
          //  console.log("responsedata", this.responseData)
         }
        });
    }

    delete(beat) {
      var pId = JSON.parse(localStorage.getItem('ParentId'))
      // var stdId = JSON.parse(localStorage.getItem('StudentID'))
      const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          width: '350px',
          hint: 'patrolmanBeatDelete',
          beatId: beat
      };
        let dialogRef = this.dialog.open(DeleteBeatComponent, dialogConfig)
       .afterClosed().subscribe(dialogResult => {
        this.getPatrolmanExistingBeat(pId, this.sId,'0')
       });
    }

    ngOnDestroy() {
      let input = {
        "event":"stop_track"
      }
      // console.log("inp", input)
      this.liveLocServ.sendMsg(input);
      this._onDestroy.next();
      this._onDestroy.complete();
    }
}
