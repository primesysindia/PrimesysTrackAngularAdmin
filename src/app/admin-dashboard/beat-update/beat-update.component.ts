import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output ,AfterViewInit,  OnDestroy } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserDataService } from '../../services/user-data.service';
import { GetDeviceService } from '../../services/get-device.service';
import { BeatServiceService } from '../../services/beat-service.service';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { AddBeatFormComponent } from '../add-beat-form/add-beat-form.component';
import { KeyManBeatList, ParentUserList} from '../../core/post';
import { FormControl} from '@angular/forms';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { EditBeatComponent } from '../edit-beat/edit-beat.component';
import { onMainContentChange } from '../../core/animation';
import { SidenavService } from '../../services/sidenav.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { environment } from 'src/environments/environment';
import { LiveLocationService } from '../../services/live-location.service';
import { CustomCommandModuleComponent } from '../custom-command-module/custom-command-module.component';
import { DeleteBeatComponent } from '../../admin-dashboard/delete-beat/delete-beat.component';

@Component({
  selector: 'app-beat-update',
  templateUrl: './beat-update.component.html',
  styleUrls: ['./beat-update.component.css'],
  animations: [ onMainContentChange ]
})
export class BeatUpdateComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
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
  tableHeader: Array<string> = ['KmStart', 'KmEnd', 'SectionName', 'Start_Lat', 'Start_Lon', 'End_Lat', 
  'End_Lon', 'action', 'delete', 'status'];
  dataSource :any = [];
  beatData: MatTableDataSource<KeyManBeatList>;
  ParentId: any;
  StudentID: any;
  parentlist = new FormControl();
  allPosts: any;
  autoCompleteList: any[]
  bId: any = 0;
  isTableHasData: boolean = true;
  result: boolean;
  showApprove: boolean;
  approved: boolean;
  sId :any;
  imeiNo: any;
  stdName: any;
  userInfo: any;
  loginName: any; 
  responseData: any;
  message: any;
  device: any;
  name: any;
  std_id: any;
  secondMsg: any;
  showTable : boolean= false;


  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  public onSideNavChange: boolean;

  public deviceFilterCtrl: FormControl = new FormControl();
  /** list of devices filtered by search keyword */
  public filteredDevices: ReplaySubject<DevicesInfo[]> = new ReplaySubject<DevicesInfo[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor(private dataService: UserDataService, 
    private getDevice: GetDeviceService, 
    private beatService: BeatServiceService,
    private liveLocServ: LiveLocationService, 
    public dialog: MatDialog, private _sidenavService: SidenavService) 
    {
      this._sidenavService.sideNavState$.subscribe( res => {
        // console.log(res)
        this.onSideNavChange = res;
      })
     }

  ngOnInit() {
   
    this.userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var roleId = this.userInfo.roleId; 
    this.loginName = this.userInfo.userName;
    if(roleId == 4 || roleId == 20) {
      this.showApprove = true;
      this.approved = false;
    } else {
      this.showApprove = false;
      this.approved = true;

    }
    this.initIoConnection();
    this.getParentData()
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
      return [];
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
    this.devList = []
    this.dataSource =[]
    this.secondMsg = [];
    this.message = [];
    this.showAddButton = false;
    this.filteredDevices.next([]); 
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

  parId: any;
  //call getDevices function on parent select
  optionClicked(event: Event, user: ParentUserList) {
    this.secondMsg = [];
    this.message = [];
    this.getDevices( user.parentId);
    this.parId = user.parentId;
    localStorage.setItem('ParentId', JSON.stringify(user.parentId));
  }

  //get student list
  getDevices(pId){
    this.devList = []
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
    onSelection(event, devices) {
      // console.log("device", devices)
      this.secondMsg = [];
      this.message = [];
      this.sId = devices.student_id;
      this.imeiNo = devices.imei_no;
      this.stdName = devices.name;
      this.dataSource = []
      this.showAddButton = true;
      
      let input = {
        "event":"start_track",
        "student_id": +this.sId
      }
      // console.log("start track", input)
      this.liveLocServ.sendMsg(input);

      if(event.isUserInput) {
        var dId = event.source.value;
        localStorage.setItem('StudentID', dId);
        this.ParentId = JSON.parse(localStorage.getItem('ParentId'))

        //keymanexisting beat api call
        this.getKeymanBeat(this.ParentId, this.sId, this.bId)
      }
    }
    filteredData: any;
    // show data in material datatable
    getKeymanBeat(pId, dId, bId) {
      this.loading = true;
      this.beatService.getKeymanBeat(pId, dId, bId).subscribe((res: Array<KeyManBeatList>)=> {
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
          this.beatData = new MatTableDataSource<KeyManBeatList>(res);
          this.dataSource = this.beatData;
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

  //Open dialog for add-beat form
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    //pass data to dialog
    dialogConfig.data = {
        width: '600px',
        pId: this.parId,
        stdId: this.sId,
        devName: this.stdName,
        imei: this.imeiNo,
    };
     let dialogRef = this.dialog.open(AddBeatFormComponent, dialogConfig)
     .afterClosed().subscribe((result) => {
      this.getKeymanBeat(this.parId, this.sId, '0');
    })
  }

  // Open edit-form dialog
  openEditDialog(beat): void {
    const dialogConfig = new MatDialogConfig();
    localStorage.setItem('beatId',JSON.stringify(beat))
    var pId = JSON.parse(localStorage.getItem('ParentId'))
    var stdId = JSON.parse(localStorage.getItem('StudentID'))
    this.beatService.getKeymanBeatById(pId, stdId, beat).subscribe((res: Array<KeyManBeatList>)=> {
      dialogConfig.width = '600px';
      // dialogConfig.data = res;
      dialogConfig.data = {
        // width: '600px',
        pId: this.parId,
        stdId: this.sId,
        devName: this.stdName,
        imei: this.imeiNo,
        response: res
      };
      // console.log("id",dialogConfig.data)

      let dialogRef = this.dialog.open(EditBeatComponent, dialogConfig)
      .afterClosed().subscribe((result) => {
        this.getKeymanBeat(pId, stdId, beat);
      })
  })
  }

  confirmDialog(beat) {
    const message = 'Do you want to approve this?';
    // const dialogData = new ConfirmDialogModel("Please Confirm", message);
    const dialogConfig = new MatDialogConfig();

    localStorage.setItem('beatId',JSON.stringify(beat))
    var pId = JSON.parse(localStorage.getItem('ParentId'))
    var stdId = JSON.parse(localStorage.getItem('StudentID'))
    this.beatService.getKeymanBeatById(pId, stdId, beat).subscribe((res: Array<KeyManBeatList>)=> {
      // dialogConfig.width = '600px';
      dialogConfig.data = res;
      dialogConfig.maxWidth= "400px";
      // console.log("id",dialogConfig.data)

      let dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig)
  
     .afterClosed().subscribe(dialogResult => {
        this.result = dialogResult;
        this.getKeymanBeat(pId, stdId, beat);
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
        this.responseData = JSON.parse(response.data);
        this.showTable = true;
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
    const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        width: '350px',
        hint: 'keymanBeatDelete',
        beatId: beat
    };
      let dialogRef = this.dialog.open(DeleteBeatComponent, dialogConfig)
     .afterClosed().subscribe(dialogResult => {
      this.getKeymanBeat(this.parId, this.sId, '0');
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