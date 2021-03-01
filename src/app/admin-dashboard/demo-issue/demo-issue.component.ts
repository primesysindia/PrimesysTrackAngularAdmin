import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output, AfterViewInit,  OnDestroy  } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserDataService } from '../../services/user-data.service';
import { GetDeviceService } from '../../services/get-device.service';
import { BeatServiceService } from '../../services/beat-service.service';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import {  ParentUserList, IssueList, GetExchangedDeviceList} from '../../core/post';
import { FormControl} from '@angular/forms';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { onMainContentChange } from '../../core/animation';
import { SidenavService } from '../../services/sidenav.service';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { User } from '../../core/user.model';
import { GoogleMap } from '@agm/core/services/google-maps-types';
import { AddIssueComponent } from '../add-issue/add-issue.component';
import { LiveLocationService } from '../../services/live-location.service';
import { WebsocketService } from '../../services/websocket.service';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { EditIssueComponent } from '../edit-issue/edit-issue.component';
import { ExchangeHistoryComponent } from '../exchange-history/exchange-history.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CustomCommandModuleComponent } from '../custom-command-module/custom-command-module.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-demo-issue',
  templateUrl: './demo-issue.component.html',
  styleUrls: ['./demo-issue.component.css']
})
export class DemoIssueComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  parentUser: any;
  parentList: ParentUserList[];
  filteredList: any;
  loading: boolean= true;
  devList: Array<DevicesInfo>;
  devicesListss: Array<DevicesInfo>;
  ParentId: any;
  StudentID: any;
  parentlist = new FormControl();
  allPosts: any;
  autoCompleteList: any[];
  lat: number;
  lan: number;
  currUser: User;
  protected map: any;
  mapTypeId: string;
  USAUser: boolean;
  overspeedLimit: number;
  RoadmapView: boolean = true;
  commandData: any;
  commands: any;
  showDescription: boolean = false;
  student: any;
  imeiNo: any;
  response: any;
  responseData: any;
  std_id: any;
  message: any;
  showTable: boolean = false;
  dataSource :any = [];
  issueData: MatTableDataSource<IssueList>;
  showButton: boolean = false;
  iconUrl: string = '../assets/Green_marker.png';
  tableHeader: Array<string> = ['issueTitle', 'contactPerson', 'contactPersonMobNo',  
  'issueStatus', 'priority', 'createdAt', 'issueOwner', 'action'];
  expandedElement: any;
  issueButton: boolean = false;
  markers: Array<any> = [];
  allLocations: Array<any> = [];
  data: any = [];
  beatInfo: any;
  simNo: any;
  marker: any;
  zoomLevel = 4;
  loginName: any;
  deviceName: any;
  receivedValues: any;
  showCommand: boolean = false;
  staticValue: any;
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  public onSideNavChange: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
    private wsServ: WebsocketService,
    public dialog: MatDialog, private _sidenavService: SidenavService) 
    {
      this._sidenavService.sideNavState$.subscribe( res => {
        // console.log(res)
        this.onSideNavChange = res;
      })
     }

  ngOnInit() {
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'))
    this.loginName = this.currUser.userName;
    this.USAUser = JSON.parse(localStorage.getItem('USAUser'))
    this.getParentData();
  }
  getParentData() {
    this.loading = true;
    this.dataService.getAllParentId()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data: any) => {
      if(data.length == 0){
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
    this.issueButton = false;
    this.beatInfo = [];
    this.data = [];
    this.dataSource = [];
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

  //call getDevices function on parent select
  optionClicked(event: Event, user: ParentUserList) {
    this.getDevices( user.parentId);
    localStorage.setItem('ParentId', JSON.stringify(user.parentId));
  }

 

  // on click event get value of command 
  // onOptionClicked(event: Event, command) {
  //   this.commands = command.command;
  //   this.showDescription = true;
  // }

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

  onSelection(event: Event, student) {
    console.log("std", student);
    // console.log("imwi", this.imeiNo);
    this.student = '';
    this.imeiNo = '';
    this.issueButton = true;
    this.showButton = true;
    this.student = student.student_id;
    this.imeiNo = student.imei_no;
    this.simNo = student.simNo; 
    this.deviceName = student.name;
      localStorage.setItem('DeviceInfo', JSON.stringify(student));
      // this.getIssueDetails();
      if(event) {
        this.getDevicesInfoAndIssue(this.student, this.imeiNo)
      }
     
      this.markers = [];
      // let input = {
      //   "event":"start_track",
      //   "student_id": +this.student
      // }
      // // console.log("inp", input)
      // this.liveLocServ.sendMsg(input);
  }
  getDevicesInfoAndIssue(std_id, imei_no) {
    let lat, lng: number;
    let icon :string = '';
    this.zoomLevel = 4;
    this.loading = true;
    this.beatInfo = [];
    this.data = [];
    this.dataSource = [];
    this.markers = [];
    this.allLocations = [];
    this.beatService.GetDeviceInfoAndIssue(std_id, imei_no)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((res: Array<IssueList>)=> {
      this.loading = false;
      this.data = res;
      console.log("dtaa",  this.data)
      this.beatInfo = this.data.beatInfoList;
      this.issueData = new MatTableDataSource<IssueList>(this.data.issueList);
      this.dataSource = this.issueData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // this.getIssueDetails(std_id, imei_no);
     
      // this.map.setCenter({ lat: +this.data.lat, lan: +this.data.lan })
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

}
