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
import { DatePipe } from '@angular/common';
import { WebsocketService } from '../../services/websocket.service';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { EditIssueComponent } from '../edit-issue/edit-issue.component';
import { ExchangeHistoryComponent } from '../exchange-history/exchange-history.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CustomCommandModuleComponent } from '../custom-command-module/custom-command-module.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-issue-tracking',
  templateUrl: './issue-tracking.component.html',
  styleUrls: ['./issue-tracking.component.css'],
  // animations: [ onMainContentChange ],
  animations: [onMainContentChange,
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IssueTrackingComponent implements OnInit {
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
  tableHeader: Array<string> = ['issueTicketId','issueTitle', 'contactPerson', 'contactPersonMobNo',  
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
  dateActivation: any;
  activation: any;
  currDate: Date = new Date();
  timestamp: any;
  warrantyMsg: boolean = false;
  expiredWarranty: boolean = false;
  imagesUrl: string ="http://mykiddytracker.com:81/Images/"

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
    public datePipe: DatePipe,
    private wsServ: WebsocketService,
    public dialog: MatDialog, private _sidenavService: SidenavService) 
    {
      this._sidenavService.sideNavState$.subscribe( res => {
        // console.log(res)
        this.onSideNavChange = res;
      })
     }

    public mapReady(map: GoogleMap) {
      let mapOptions = {
        minZoom: 1,
        center: new google.maps.LatLng(this.lat, this.lan),
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.TERRAIN, 'map_style', google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID]
        },
        // fullscreenControl:true
      };
      //for highlight rail track on google map
      if(this.currUser.accSqliteEnable == 0){
          var styledMap = new google.maps.StyledMapType([
            {
            "featureType": "administrative",
            "elementType": "all",
            "stylers": [
                        {
                        "visibility": "off"
                        }
                        ]
            },
          
          
               {
                 "featureType": "transit",
                 "stylers": [
                   {
                     "visibility": "on"
                   }
                 ]
               },
               {
                 "featureType": "transit.station.rail",
                 "elementType": "geometry.fill",
                 "stylers": [
                   {
                     "visibility": "on"
                   }
                 ]
               },
               {
                 "featureType": "transit.station.rail",
                 "elementType": "labels.icon",
                 "stylers": [
                   {
                     "visibility": "on"
                   },
                   {
                     "weight": 5
                   }
                 ]
               },
               {
                 "featureType": "transit.station.rail",
                 "elementType": "labels.text",
                 "stylers": [
                   {
                     "color": "#813f4b"
                   },
                   {
                     "visibility": "on"
                   },
                   {
                     "weight": 4.5
                   }
                 ]
               },
               {
                 "featureType": "transit.station.rail",
                 "elementType": "labels.text.fill",
                 "stylers": [
                   {
                     "saturation": -45
                   },
                   {
                     "lightness": 100
                   },
                   {
                     "visibility": "simplified"
                   },
                   {
                     "weight": 4.5
                   }
                 ]
               },
               {
                 "featureType": "transit.station.rail",
                 "elementType": "labels.text.stroke",
                 "stylers": [
                   {
                     "visibility": "on"
                   }
                 ]
               }
             ,
            {
            "featureType": "road.local",
            "elementType": "all",
            "stylers": [
                        {
                        "visibility": "on"
                        }
                        ]
            },
            {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                        {
                        "color": "#6f4e37"
                        }
                        ]
            },
          
            {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                        {
                        "color": "#0dabeb"
                        }
                        ]
            }
            ], {
            name: "Styled Map"
          });
          this.map = map
          this.map.setOptions(mapOptions)
          this.map.mapTypes.set('map_style', styledMap);
          this.map.setMapTypeId('map_style');
          this.mapTypeId = "map_style"
      }
      else{
        this.map = map
        this.map.setOptions(mapOptions)
        this.map.setMapTypeId('roadmap');
        this.mapTypeId = "roadmap"
      }
    }
    
    public setMapType(){
      if(this.currUser.accSqliteEnable == 0){
        if(this.mapTypeId == 'map_style')
        {
          this.mapTypeId = "hybrid"
          this.map.setMapTypeId('hybrid');
          this.RoadmapView = false
        }
        else{
          this.mapTypeId = "map_style"
          this.map.setMapTypeId('map_style');
          this.RoadmapView = true
        }
      }
      else{
        if(this.mapTypeId == 'roadmap'){
          this.mapTypeId = "hybrid"
          this.map.setMapTypeId('hybrid');
          this.RoadmapView = false
        }
        else{
          this.mapTypeId = "roadmap"
          this.map.setMapTypeId('roadmap');
          this.RoadmapView = true
        }
      }
    }

  ngOnInit() {
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'))
    this.loginName = this.currUser.userName;
    this.USAUser = JSON.parse(localStorage.getItem('USAUser'))
    this.getParentData();
    this.initIoConnection();

    if(this.USAUser){
      this.lat = 38.450362;
      this.lan = -76.895380;
      this.overspeedLimit = 65
    }
    else{
      this.lat = 23.80544961;
      this.lan = 80.33203125;
    }
  }

  // initiate socket connection
  private initIoConnection(): void{
    let webSocketUrl = 'ws://'+this.currUser.socketUrl+':'+environment.portNo+'/bullet';
    this.liveLocServ.initSocket(webSocketUrl);
  }

  // get configuration command list
  getCommandsList() {
    this.beatService.getDevicesCommand().subscribe((res: any) =>{
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'NoParentList'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.commandData = res;
        // console.log("this.command", this.commandData);
      }
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

  showInput: any;
  value: any;
  title: any;
   // On radio button click get its value 
   onOptionClicked(event, commands) {
    this.showInput = false;
    this.commands = commands.command;
    this.value = commands.command;
    this.title = commands.title;
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
    else {
      this.showCommand = true;
      this.staticValue = this.value;
    }
  }

  // get data from popup of custom command
  public receivedData(data: any) {
    this.receivedValues = data;
    // console.log("received", this.receivedValues)
    this.showCommand = true;
  }

  // get parent list
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
          this.getCommandsList();
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
  
  // on device selection get its value
  onSelection(event: Event, student) {
    this.issueButton = true;
    this.showButton = true;
    this.student = student.student_id;
    this.imeiNo = student.imei_no;
    this.simNo = student.simNo; 
    this.deviceName = student.name;
      localStorage.setItem('DeviceInfo', JSON.stringify(student));
      // this.getIssueDetails();
      this.getSingleIssue(this.student);
      this.getDeviceInfoAndIssue(this.student, this.imeiNo)
      this.markers = [];
      let input = {
        "event":"start_track",
        "student_id": +this.student
      }
      // console.log("inp", input)
      this.liveLocServ.sendMsg(input);
  }

  // open add issue form
  // openDialog(): void {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = '1000px';
  //   dialogConfig.height = '500px';
  //   dialogConfig.data = {
  //     imeiNo:  this.imeiNo,
  //     studentId:this.student,
  //     deviceName: this.deviceName
  // };
  //   let dialogRef = this.dialog.open(AddIssueComponent, dialogConfig)
  //   .afterClosed().subscribe((result) => {
  //     this.getIssueDetails( this.student, this.imeiNo);
  //   })
  // }
    device: any;
    name: any;
    secondMsg: any;
    //send command to socket 
    sendCommand() {

      if(this.receivedValues) {
        var inputData =  {
          "event":"send_command",
          "student_id": +this.student,
          "data":{
            "command": this.receivedValues,
            "device": this.imeiNo,
            "deviceName": this.deviceName,
            "loginName": this.loginName
          }
        };
        // console.log("first condition", inputData);
      } 
      else {
        this.receivedValues = '';
        var inputData =  {
          "event":"send_command",
          "student_id": +this.student,
          "data":{
            "command": this.commands,
            "device":this.imeiNo,
            "deviceName": this.deviceName,
            "loginName": this.loginName
          }
        };
      }
    
    // console.log("inputData", inputData)
    this.liveLocServ.sendMsg(inputData)
    this.liveLocServ.messages.takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
         this.response = res;
         this.responseData = JSON.parse(this.response.data);
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
      })
    }

    // get existing issue list and display in datatable
    getIssueDetails(std_id, imei_no) {
      this.loading = true;
      this.beatService.GetDeviceInfoAndIssue(std_id, imei_no).subscribe((res: Array<IssueList>)=> {
        this.loading = false;
        if(res.length == 0){
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'issueHistoryNotFound'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        } else {
          this.data = res;
          // console.log("fgdfg", this.data)
          this.activation = this.data.ActivationDate;
          var d: Date = new Date();
          var activeDate= new Date(this.activation);
          this.dateActivation = activeDate.setFullYear(activeDate.getFullYear() + 1); 
          
          this.timestamp = this.currDate.getTime();
          if(this.dateActivation <= this.timestamp ) {
            this.warrantyMsg = false;
            this.expiredWarranty = true;
          } else {
            this.expiredWarranty = false;
            this.warrantyMsg = true;
          }
          this.beatInfo = this.data.beatInfoList;
         
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

    // open edit issue form dialog
    openEditDialog(issueId) {
      localStorage.setItem('issueId',JSON.stringify(issueId))
      const dialogConfig = new MatDialogConfig();

      this.beatService.getIssueDetailsById(issueId).subscribe((res: Array<IssueList>)=> {
        dialogConfig.width = '1000px';
        dialogConfig.height = '550px';
        dialogConfig.data = res;
        // console.log("id",dialogConfig.data)
  
        let dialogRef = this.dialog.open(EditIssueComponent, dialogConfig)
        .afterClosed().subscribe((result) => {
          this.getIssueDetails(this.student, this.imeiNo);
        })
    })
    }

  // get history of exhanged device
    getHistory() {
      var parent_id = JSON.parse(localStorage.getItem('ParentId'))
      const dialogConfig = new MatDialogConfig();
      this.beatService.GetAllDeviceExchange(parent_id).subscribe((res: Array<GetExchangedDeviceList>)=> {
        dialogConfig.width = '900px';
        dialogConfig.height = '450px';
        dialogConfig.data = res;
  
        let dialogRef = this.dialog.open(ExchangeHistoryComponent, dialogConfig)
        .afterClosed().subscribe((result) => {
          // this.getIssueDetails();
        })
    })
    }
    
    // get info about device
    getDeviceInfoAndIssue(std_id, imei_no) {
      let lat, lng: number;
      let icon :string = '';
      let markerIcon :string = '';
      this.zoomLevel = 4;
      this.loading = true;
      this.beatInfo = [];
      this.data = [];
      this.dataSource = [];
      this.markers = [];
      this.allLocations = [];
      this.beatService.GetDeviceInfoAndIssue(std_id, imei_no)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data) => {
        // console.log("data", data)
        this.loading = false;
        this.data = data;
        this.beatInfo = this.data.beatInfoList;
        this.getIssueDetails(std_id, imei_no);
        let d: Date = new Date();
        var timeDiff = (parseInt(d.getTime()/1000+"")) - this.data.locationTime; 
        // console.log("time did", timeDiff)
        if(timeDiff<300){
          markerIcon = this.imagesUrl+'Green_marker.svg';
        } else {
          markerIcon = this.imagesUrl+'Red_marker.svg'
        }
        this.markers.push({
          lat: +this.data.lat,
          lng: +this.data.lan,
          icon: markerIcon
        })
        this.allLocations = this.markers;  
        let myLatlng = new google.maps.LatLng(this.data.lat, this.data.lan)
          this.marker = new SlidingMarker({
            position: myLatlng,
            map: this.map,
            title: "Device",
            duration: 1200,
            easing: "easeOutExpo",
            icon:  {
              url: icon,
              rotation: 0
            }
          });
          this.zoomLevel = 16;
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


    getSingleIssue(stdId) {
      this.loading = true;
      this.beatService.getSingleIssue(stdId).subscribe((res: Array<IssueList>)=> { 
        this.loading = false;
        if(res.length == 0){
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'issueHistoryNotFound'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        } else {
          this.loading = false;
          this.issueData = new MatTableDataSource<IssueList>(res);
          this.dataSource = this.issueData;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // console.log("single issue",  this.dataSource)
        }
        (error: any) => { 
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'ServerError'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
      })
    }
    ngOnDestroy(): void{
      let input = {
        "event":"stop_track"
      }
      // console.log("inp", input)
      this.liveLocServ.sendMsg(input);
      this.wsServ.closeConnection()
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }

}
