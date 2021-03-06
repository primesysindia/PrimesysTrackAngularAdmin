import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, AfterViewInit,  OnDestroy  } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';
import { GetDeviceService } from '../../services/get-device.service';
import { User } from '../../core/user.model';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LocationInfo } from '../../core/locationInfo.model';
import { AllDevicesLocation } from '../../core/allDeviceLocation.model';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { ReportService } from '../../services/report.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { PlatformLocation, DatePipe } from '@angular/common';
import { LiveLocationService } from '../../services/live-location.service';
import { WebsocketService } from '../../services/websocket.service';
import { SortDevicesPipe } from '../../filters/sort-devices.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { AllLocationPipe } from '../../filters/all-location.pipe';
import { environment } from 'src/environments/environment';
import { LoginService } from '../../services/login.service';
import { FeatureAddress } from '../../core/featureAddress.model';
import { UserDataService } from '../../services/user-data.service';
import { FormControl} from '@angular/forms';
import {  ParentUserList} from '../../core/post';
import { BeatServiceService } from '../../services/beat-service.service';

@Component({
  selector: 'app-device-tracker',
  templateUrl: './device-tracker.component.html',
  styleUrls: ['./device-tracker.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('150ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('slideVerticle', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1, display: 'none' }),
        animate('500ms', style({ transform: 'translateY(-100%)', opacity: 0 })),
      ])
    ])
  ],
  providers: [SortDevicesPipe, AllLocationPipe]
})
export class DeviceTrackerComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  lat: number;
  lng: number;
  currUser: User;
  devicesList: Array<DevicesInfo>;
  devicesListss: Array<DevicesInfo>;
  devList: Array<DevicesInfo>;
  showSearchText: boolean;
  status: boolean = false;
  searchText: string;
  locations: Array<LocationInfo>;
  showSortByType: boolean;
  sortType: string[] = ['All', 'KeyMan', 'PatrolMan', 'Mate'];
  sortBy: string = "All";

  //All location data
  allDevLocation: Array<AllDevicesLocation>;
  zoomLevel:number = 5;
  protected map: any;
  markers: Array<any> = [];
  allLocations: Array<any> = [];
  address: string;
  //d: Date = new Date();
  mapTypeId: string;
  RoadmapView: boolean = true;
  selectedItem:string;

  //spinner
  public loading:boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  //All device location
  userType: string = localStorage.getItem('userType');
  offDeviceCnt: number = 0;
  onDeviceCnt: number = 0;
  stoppageDevCnt: number = 0;
  totalDevices: number;
  showInfoCard: boolean;
  showStoppageDevices: boolean = false;
  showCluster: boolean = false;
  showFeatureAddress:boolean = false;
  featureAdrs: Array<any>;
  sortedFeatureAdrs: Array<any>=[];
  showAllbtn: boolean = false;
  showInfoMsg: boolean = false;
  SortForAllLocation: string = 'all';
  //RDPS data icons
  featureIcon: string ="http://www.mykiddytracker.com:81";
  imagesUrl: string ="http://mykiddytracker.com:81/Images/"
  browserName: string = localStorage.getItem('browserName')
  rdpsDataAvail: boolean;
  railwayUser: boolean = false;
  showRdpsMsg: boolean = false;
  //live tracking data
  USAUser: boolean;
  liveTrack: LocationInfo;
  currLocation: Array<any> = [];
  liveLocation: Array<any> = [];
  showLiveLocation: boolean = false;
  overspeedLimit: number;
  selectedDevice: string;
  currAddress: string;
  currSpeed: number;
  currDate: number;
  iconUrl: string = '../assets/dot.svg';
  location1: any;
  location2: any;
  marker: any;
  car: string = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z"
  selDeviceType: string;
  selDevice: string;
  markerIcon:string;
  showGoogleAddress: string;
  smallestDistance: any;
  locationKmPole: string;
  smallDistance: string;
  batteryImage: string;
  gsmSignalImage: string;
  batteryLevel: string;
  gsmSignalLevel: string;
  @ViewChild('liveLocMarker') liveLocMarker: ElementRef;
  //css
  screenHeight:any;
  screenWidth:any;
  showDeviceList: boolean = true;
  //webSQL database
  db: any;
  ParentId: any;
  StudentID: any;
  parentlist = new FormControl();
  allPosts: any;
  autoCompleteList: any[];
  pId: any;
  devListss: any;
  rdps: any;

  deviceFilterCtrl: FormControl = new FormControl();
  /** list of devices filtered by search keyword */
  public filteredDevices: ReplaySubject<DevicesInfo[]> = new ReplaySubject<DevicesInfo[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  constructor(private getDevice:GetDeviceService,
              public dialog: MatDialog,
              public reportServ: ReportService,
              public location: PlatformLocation,
              private liveLocServ: LiveLocationService,
              private wsServ: WebsocketService,
              private sortPipe: SortDevicesPipe,
              private allLocationPipe: AllLocationPipe,
              public datePipe: DatePipe,
              private loginServ: LoginService,
              private dataService: UserDataService, 
              private sanitizer: DomSanitizer,
              private beatService: BeatServiceService) 
  {}

  public mapReady(map) {
    let mapOptions = {
      minZoom: 5,
      center: new google.maps.LatLng(this.lat, this.lng),
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.TERRAIN, 'map_style', google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID]
      },
      fullscreenControl:true
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
    this.USAUser = JSON.parse(localStorage.getItem('USAUser'))
    //method for socket connection
    this.initIoConnection();
    //method for fetching device list
    // this.getDevices();
    this.getParentData();
    /* //method for fetching all device locations
    this.getAllDeviceLocation(); */
    this.devicesList = JSON.parse(localStorage.getItem('devicesList'))
    this.devList = this.devicesList
    this.showSearchText = JSON.parse(localStorage.getItem('showSearchText'))
    this.featureAdrs = JSON.parse(localStorage.getItem('featureAddress'))
    
    //fetch live location
    this.getCurrentLocation();
    this.showInfoMsg = true;
    setTimeout(()=>{
      this.showInfoMsg = false;
    }, 5000)

    if(this.USAUser){
      this.lat = 38.450362;
      this.lng = -76.895380;
      this.overspeedLimit = 65
    }
    else{
      this.lat = 20.593683;
      this.lng = 78.962883;
      if(this.currUser.accSqliteEnable == 0)
        this.overspeedLimit = 8
      else
        this.overspeedLimit = 50
    }
  }

  getStyle(){
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if(this.devicesList){
      if(this.devicesList.length == 1){
        this.showInfoCard = false;
        this.showAllbtn = false;
        let listShow = document.getElementsByClassName('hide-dev-list')[0] as HTMLElement;
        listShow.style.visibility = 'hidden';
      }
      if(this.devicesList.length>=10){
        let styles
        if(this.screenHeight < 768){
         styles = {
            'height': "84%",
            'margin-top': '0.5rem'
          };
        }
        else if(this.screenHeight == 600){
          styles = {
             'height': "80%",
             'margin-top': '0.5rem'
           };
         }
        else{
          styles = {
            'height': "85%",
            'margin-top': '0.5rem'
          };
        }
        return styles;
      }
      else{
        let styles
        if(this.screenHeight < 720){
          styles = {
            'height': this.devicesList.length*12+'%',
            'margin-top': '1rem'
           };
         }
         else {
          styles = {
          'height': this.devicesList.length*10+'%',
          'margin-top': '1rem'
          }
        }
        return styles;
      }
    }
  }

  setStyle(){
    let styles;
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if(this.showSortByType){
      if(this.screenHeight > 1300){
        styles = {
          'height': "96vh"
        };
      }
      else if(this.screenHeight < 1300){
        styles = {
          'height': "80vh"
        };
      }
      else if(this.screenHeight < 768){
        styles = {
          'height': "75vh"
        };
      }
      /* else if(this.screenHeight < 500){
        styles = {
          'height': "60vh"
        };
      } */
    }
    else{
      styles = {
        'height': "98vh"
      };
    }
    return styles;
  }

  hideSeekDevList(){
    this.showDeviceList = !this.showDeviceList
  }

  private initIoConnection(): void{
    let webSocketUrl = 'ws://'+this.currUser.socketUrl+':'+environment.portNo+'/bullet';
    this.liveLocServ.initSocket(webSocketUrl);
  }

  sortByType(){
    this.devList = this.sortPipe.transform(this.devicesList,this.sortBy)
  }

  sortForAllLocation(){
    this.allLocations = this.allLocationPipe.transform(this.markers,this.SortForAllLocation)
    // console.log("this, ", this.allLocations)
  }

  getCurrentLocation(){
    this.liveLocServ.messages
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
      console.log("res", res)
      this.loading = true;
      this.liveTrack = JSON.parse(res.data);
      let speed = 0
      if(this.liveTrack.event == 'current_location'){
        this.selectedItem = this.selDevice;
        let latitude:number, longitude: number;
        if((this.liveTrack.data.lan_direction.includes('N') || this.liveTrack.data.lat_direction.includes('n'))
          && (this.liveTrack.data.lan_direction.includes('E') || this.liveTrack.data.lan_direction.includes('e')))
        {
          latitude = this.liveTrack.data.lat;
          longitude = this.liveTrack.data.lan;
        }
        else if((this.liveTrack.data.lat_direction.includes('N') || this.liveTrack.data.lat_direction.includes('n'))
          && (this.liveTrack.data.lan_direction.includes('W') || this.liveTrack.data.lan_direction.includes('w')))
          {
            latitude = this.liveTrack.data.lat;
            longitude = -this.liveTrack.data.lan;
          }
        else if((this.liveTrack.data.lat_direction.includes('S') || this.liveTrack.data.lat_direction.includes('s'))
          && (this.liveTrack.data.lan_direction.includes('E') || this.liveTrack.data.lan_direction.includes('e')))
          {
            latitude = -this.liveTrack.data.lat;
            longitude = this.liveTrack.data.lan;
          }
        else if((this.liveTrack.data.lat_direction.includes('S') || this.liveTrack.data.lat_direction.includes('s'))
          && (this.liveTrack.data.lan_direction.includes('W') || this.liveTrack.data.lan_direction.includes('w')))
          {
            latitude = -this.liveTrack.data.lat;
            longitude = -this.liveTrack.data.lan;
          }
        this.liveTrack.data.lan = longitude;
        this.liveTrack.data.lat = latitude;  
        //console.log(this.liveTrack)
        let d: Date = new Date();
        let timeDiff = (parseInt(d.getTime()/1000+"")) - this.liveTrack.data.timestamp; 
        if(this.selDeviceType == 'Car'){
          if(this.liveTrack.data.speed > 0 && timeDiff<300){
            this.markerIcon = this.imagesUrl+'Green_Car.svg';
            if(this.marker != undefined){
              let icon = this.marker.getIcon();
              icon.url = this.markerIcon
              this.marker.setIcon(icon)
            }
          }
          else if(this.liveTrack.data.speed == 0 && timeDiff<300){
            this.markerIcon = this.imagesUrl+'Blue_Car.svg';
            if(this.marker != undefined){
              let icon = this.marker.getIcon();
              icon.url = this.markerIcon
              this.marker.setIcon(icon)
            }
          } 
          else if(timeDiff>300){
            this.markerIcon = this.imagesUrl+'Red_Car.svg';
            if(this.marker != undefined){
              let icon = this.marker.getIcon();
              icon.url = this.markerIcon
              this.marker.setIcon(icon)
            }
          }
        }
        else if(this.selDeviceType == 'Child'){
          if(timeDiff < 300){
            this.markerIcon = this.imagesUrl+'Green_marker.svg';
            if(this.marker != undefined){
              let icon = this.marker.getIcon();
              icon.url = this.markerIcon
              this.marker.setIcon(icon)
            }
          }
          else
            this.markerIcon = this.imagesUrl+'Red_marker.svg';
            if(this.marker != undefined){
              let icon = this.marker.getIcon();
              icon.url = this.markerIcon
              this.marker.setIcon(icon)
            }
        }
        else{
          this.markerIcon = '../assets/ic_markerboy.png'
          if(this.marker != undefined){
            let icon = this.marker.getIcon();
            icon.url = this.markerIcon
            this.marker.setIcon(icon)
          }
        }
        this.liveLocation.push(this.liveTrack)
        this.map.setCenter({lat: this.liveTrack.data.lat, lng: this.liveTrack.data.lan});
        this.zoomLevel = 16;
        this.markers = [];
        this.allLocations = [];
        this.sortedFeatureAdrs = [];
        if(this.userType == 'Child'){
          this.batteryLevel = this.liveTrack.data.voltage_level+''
          this.gsmSignalLevel = this.liveTrack.data.gsm_signal_strength+''
          //To show battery status
          switch(this.batteryLevel){
            case '1': {
              this.batteryImage = '../../assets/images/battery_alert.svg'
              break;
            }
            case '2': {
              this.batteryImage = '../../assets/images/battery_20.svg'
              break;
            }
            case '3': {
              this.batteryImage = '../../assets/images/battery_50.svg'
              break;
            }
            case '4': {
              this.batteryImage = '../../assets/images/battery_80.svg'
              break;
            }
            case '5': {
              this.batteryImage = '../../assets/images/battery_90.svg'
              break;
            }
            case '6': {
              this.batteryImage = '../../assets/images/battery_full.svg'
              break;
            }
            case 'data_not_found': {
              this.batteryLevel = ''
              break;
            }
            default:{
              this.batteryLevel = ''
            }
          }
          //To show gsm signal strength
          switch(this.gsmSignalLevel){
            case '0': {
              this.gsmSignalImage = '../assets/images/cellular_0.svg'
              break;
            }
            case '1': {
              this.gsmSignalImage = '../assets/images/cellular_1.svg'
              break;
            }
            case '2': {
              this.gsmSignalImage = '../assets/images/cellular_2.svg'
              break;
            }
            case '3': {
              this.gsmSignalImage = '../assets/images/cellular_3.svg'
              break;
            }
            case '4': {
              this.gsmSignalImage = '../assets/images/cellular_4.svg'
              break;
            }
            case 'data_not_found': {
              this.gsmSignalLevel = ''
              break;
            }
            default:{
              this.gsmSignalLevel = ''
            }
          }
        }
        else{
          this.batteryLevel = ''
          this.gsmSignalLevel = ''
        }

        // get rdps data 
        this.beatService.GetRDPSdata(this.liveTrack.data.lat, this.liveTrack.data.lan)
        .subscribe(data=>{
          this.rdps = data;
          this.showFeatureAddress = true;
          // console.log("rdps", this.rdps);
          this.sortedFeatureAdrs = this.rdps;
          if(this.sortedFeatureAdrs.length>0){
            this.showFeatureAddress = true;
            this.smallestDistance = this.distancePole({lat: this.liveTrack.data.lat, lng: this.liveTrack.data.lan},this.rdps);
            if(this.showGoogleAddress == "1"){
              this.locationKmPole = ""+(+this.rdps[this.smallestDistance.position].kiloMeter + ((+this.rdps[this.smallestDistance.position].distance + 
                                    this.smallestDistance.minDist)*0.001)).toFixed(4)
              this.smallDistance = this.smallestDistance.minDist.toFixed(3) + " meter from " + this.rdps[this.smallestDistance.position].featureDetail;  
            }
            else{
              this.smallDistance = this.smallestDistance.minDist.toFixed(3) + " meter from " + this.rdps[this.smallestDistance.position].featureDetail;
            }
          }
          
        })
    
        // this.getAddress(this.liveTrack.data.lat, this.liveTrack.data.lan)
        this.selectedDevice = this.selDevice
        if(this.USAUser){
          this.currSpeed = +(this.liveTrack.data.speed*0.621371).toFixed(2);
        }
        else
          this.currSpeed = this.liveTrack.data.speed;
        this.currDate = this.liveTrack.data.timestamp*1000;
        this.showInfoCard = false;
        if(this.screenWidth>500)
          this.showLiveLocation = true;
        else
          this.showLiveLocation = false;
        if(this.liveLocation.length > 1){
          if(this.currUser.accSqliteEnable == 0){
            this.loading = false;
            this.currLocation.push({
                lat:this.liveTrack.data.lat,
                lng:this.liveTrack.data.lan,
                speed: this.liveTrack.data.speed,
                timestamp: this.liveTrack.data.timestamp,
                icon:  {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 3,
                  fillColor: "#0282FB",
                  fillOpacity: 1,
                  strokeWeight: 1,
                  anchor: new google.maps.Point(0, 5),
                  rotation: 0,
                  zIndex: 0
                }
              })

              let newPosition1 = new google.maps.LatLng(this.liveTrack.data.lat, this.liveTrack.data.lan);
              this.marker.setPosition(newPosition1);
              this.setInfoWindow()
              let loc1 = new google.maps.LatLng(this.liveLocation[this.liveLocation.length-2].data.lat, this.liveLocation[this.liveLocation.length-2].data.lan)
              let loc2 = new google.maps.LatLng(this.liveTrack.data.lat, this.liveTrack.data.lan)
              //to set bearing to live location marker of arrow to railway users
              let bearing = this.bearingBetweenLocations(loc1, loc2);
              this.currLocation[this.currLocation.length-1].icon.rotation = bearing;
             /*  if(this.markerIcon !== null && this.markerIcon.includes('Green_marker.svg')){
                const node = document.querySelector('[src="http://mykiddytracker.com:81/Images/Green_marker.svg"]') as HTMLElement;
                if(node != null)
                  node.style.transform = 'rotate(' + bearing + 'deg)';
              } */
              /* this.marker.icon.rotation = bearing;
              this.marker.setIcon(this.marker.icon) */
          }
          else{
              if((this.liveTrack.data.speed > 0 && timeDiff<300)){
                this.getSnapToRoad(this.liveLocation[this.liveLocation.length-2],this.liveTrack)
                this.setInfoWindow()
              }
              else if(this.liveTrack.data.speed == 0 && timeDiff<300){
                let newLoc = new google.maps.LatLng(this.liveTrack.data.lat, this.liveTrack.data.lan);
                this.marker.setPosition(newLoc);
                this.setInfoWindow()
              }
              this.loading = false;   
          }
        }
        if(this.liveLocation.length == 1){
          if(this.currUser.accSqliteEnable == 0){
            this.currLocation.push({
              lat: this.liveTrack.data.lat,
              lng: this.liveTrack.data.lan, 
              speed: this.liveTrack.data.speed,
              timestamp: this.liveTrack.data.timestamp,
              icon:  {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 3,
                fillColor: "#0282FB",
                fillOpacity: 1,
                strokeWeight: 1,
                anchor: new google.maps.Point(0, 5),
                rotation: 0,
                zIndex: 0
              }
            })
            console.log("this.currLocation",this.currLocation)
          }
          else{
            if(this.USAUser)
              speed = +(this.liveTrack.data.speed*0.621371).toFixed(2)
            else
              speed = this.liveTrack.data.speed
            this.currLocation.push({
              lat: this.liveTrack.data.lat,
              lng: this.liveTrack.data.lan, 
              speed: speed,
              timestamp: this.liveTrack.data.timestamp,
              icon:  {
                url: this.iconUrl,
                rotation: 0
              }
            })
          }
          // if marker exists and has a .setMap method, hide it
          if (this.marker && this.marker.setMap) {
            this.marker.setMap(null);
          }
          let myLatlng = new google.maps.LatLng(this.liveTrack.data.lat, this.liveTrack.data.lan)
          this.marker = new SlidingMarker({
            position: myLatlng,
            map: this.map,
            title: "Device",
            duration: 1200,
            easing: "easeOutExpo",
            icon:  {
              url: this.markerIcon,
              rotation: 0
            /*   path: this.car,
              scale: .7,
              strokeColor: 'white',
              strokeWeight: .10,
              fillOpacity: 1,
              fillColor: 'blue',
              rotation: 0 */
            }
          });
          this.setInfoWindow()
          this.loading = false;
          if(timeDiff>300){
            let input ={
              "event": "stop_track"
            }
            this.liveLocServ.sendMsg(input)
          }
        }
        
      }
      else if(this.liveTrack.data.error_msg == "device_id_not_found"){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              devName: this.selDevice,
              hint: 'DeviceNotRegister'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
      else{
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              devName: this.selDevice,
              hint: 'liveLocationNotFound'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
    },(err) => {
      this.loading = false;
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.data = {
        devName: this.selDevice,
        hint: 'NoInternetConnection'
      };
      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
    })
  }

  setInfoWindow() {
    let $event;
    let unit, speed;
    if(this.USAUser){
      unit = ' miles/hr'
      speed = (this.liveTrack.data.speed*0.621371).toFixed(2)
    }
    else{
      unit = ' Km/hr'
      speed = this.liveTrack.data.speed
    }
    if(this.currUser.accSqliteEnable == 0)
      $event = 'mouseover'
    else
      $event = 'click'
    google.maps.event.addListener(this.marker,  $event, () => {
        let iwindow = new google.maps.InfoWindow();
        if(this.showGoogleAddress == "1" && this.currUser.accSqliteEnable == 0){
          iwindow.setContent('<div class="info-bubble" style="border-radius:5px;max-width:300px;font-weight:500;">'+
                           '<b style="color: Blue">Name: </b>' + this.selDevice + ' <b style="color: Blue">Speed:</b> '+this.liveTrack.data.speed+' Km/hr'+
                           '<b style="color: Blue"> Date & Time: </b>'+this.datePipe.transform(this.liveTrack.data.timestamp*1000, 'medium')+
                           '<b style="color: Blue"> Location: </b>'+this.locationKmPole+'Km <b style="color: Blue"> Distance: </b>'+this.smallDistance+'</div>');
        }
        else if(this.showGoogleAddress == "0" && this.currUser.accSqliteEnable == 0 && this.showFeatureAddress == true){
          iwindow.setContent('<div class="info-bubble" style="border-radius:5px;max-width:300px;font-weight:500;">'+
                           '<b style="color: Blue">Name: </b>' + this.selDevice + ' <b style="color: Blue">Speed:</b> '+this.liveTrack.data.speed+' Km/hr'+
                           '<b style="color: Blue"> Date & Time: </b>'+this.datePipe.transform(this.liveTrack.data.timestamp*1000, 'medium')+
                          //  '<b style="color: Blue"> Address: </b>'+this.currAddress+
                           '<b style="color: Blue"> Distance: </b>'+this.smallDistance+
                           '</div>');
        }
        else{
        iwindow.setContent('<div class="info-bubble" style="border-radius:5px;max-width:300px;font-weight:500;">'+
                           '<b style="color: Blue">Name: </b>' + this.selDevice + ' <b style="color: Blue">Speed:</b> '+speed+unit+
                           '<b style="color: Blue"> Date & Time: </b>'+this.datePipe.transform(this.liveTrack.data.timestamp*1000, 'medium')+
                          //  '<b style="color: Blue"> Address: </b>'+this.currAddress+
                           '</div>');
        }
        iwindow.open(this.map, this.marker);
        google.maps.event.addListener(this.marker, 'mouseout', () => {
          iwindow.close();
        });
    });
  }

  public distancePole (L1 :any, featurelist: Array<any> )
  {
    let earthRadius = 3958.75;
    let minDistance = 0;
    let position = 0;
    let meterConversion = 1609;
    for (let i=0;i<featurelist.length;i++){
        let L2 = {lat: featurelist[i].latitude, lng: featurelist[i].longitude};
        let latDiff = this.deg2rad(L2.lat) - this.deg2rad(L1.lat);
        let lngDiff = this.deg2rad(L2.lng) - this.deg2rad(L1.lng);
        let a = Math.sin(latDiff /2) * Math.sin(latDiff /2) +
                Math.cos(this.deg2rad(L1.lat)) * Math.cos(this.deg2rad(L2.lat)) *
                        Math.sin(lngDiff /2) * Math.sin(lngDiff /2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let distance = earthRadius * c;

        if (i==0)
            minDistance=distance;
        else if (distance<minDistance)
        {
            minDistance=distance;
            position=i;
        } 
    }
    return {minDist: (minDistance * meterConversion), position: position} ;
  }

  private deg2rad(deg) {
    return (deg * Math.PI / 180.0);
}

  getKmLocation(feature){
    return parseInt(feature.kiloMeter) + parseInt(feature.distance)*0.001
  }

  getSnapToRoad(location1: LocationInfo,location2: LocationInfo){
    let loc1 = new google.maps.LatLng(location1.data.lat, location1.data.lan)
    let loc2 = new google.maps.LatLng(location2.data.lat, location2.data.lan)
    let speed;
    this.liveLocServ.getSnapToRoad(loc1,loc2)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: any) =>{
        // console.log(data)
        if(data.snappedPoints.length == 0){
          return
        }
        else{ 
          for (let i = 0; i < data.snappedPoints.length; i++) {
            let lat = data.snappedPoints[i].location.latitude
            let lng = data.snappedPoints[i].location.longitude
            if(this.USAUser)
              speed = +(location1.data.speed*0.621371).toFixed(2)
            else
              speed = location1.data.speed
            let timestamp = location1.data.timestamp
            let bearing = this.bearingBetweenLocations(loc1, loc2);
            this.currLocation.push({lat:lat, lng:lng, speed: speed, timestamp: timestamp,
              icon:  {
                url: this.iconUrl,
                rotation: 0
              }
            })
            let newPosition1 = new google.maps.LatLng(lat, lng);
            this.marker.setPosition(newPosition1);
            if(this.markerIcon.includes('Green_Car.svg')){
              const node = document.querySelector('[src="http://mykiddytracker.com:81/Images/Green_Car.svg"]') as HTMLElement;
              node.style.transform = 'rotate(' + bearing + 'deg)';
            }
           /*  this.marker.icon.rotation = bearing;
            this.marker.setIcon(this.marker.icon) */
          }
        }
      }
    )
  }

  private bearingBetweenLocations(latLng1, latLng2) {

    let PI = 3.14159;
    let lat1 = latLng1.lat() * PI / 180;
    let long1 = latLng1.lng() * PI / 180;
    let lat2 = latLng2.lat() * PI / 180;
    let long2 = latLng2.lng() * PI / 180;

    let dLon = (long2 - long1);

    let y = Math.sin(dLon) * Math.cos(lat2);
    let x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let brng = Math.atan2(y, x);

    brng = brng * 180 / Math.PI;
    brng = (brng + 360) % 360;

    return brng;
  }

  public getAllDeviceLocation(){
    this.pId = JSON.parse(localStorage.getItem('ParentId'))
    this.loading = true;
    this.markers = [];
    this.allLocations = [];
    let lat, lng, speed, dateTimestamp, timeDiff: number;
    let devName: string;
    let icon: string;
    let input = {
      "event": "stop_track"
    } 
    this.liveLocServ.sendMsg(input);
    this.liveLocation = [];
    this.currLocation = [];
    this.sortedFeatureAdrs = [];
    this.showFeatureAddress = false;
    this.showLiveLocation = false;
    this.zoomLevel = 5;
    if (this.marker && this.marker.setMap) {
      this.marker.setMap(null);
    }
    this.selectedItem = '';
      this.getDevice.getAllDeviceLocation(this.pId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Array<AllDevicesLocation>) => {
          console.log("datatata",data)
          this.totalDevices = data.length; 
          if(data.length==0){
            this.loading =false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'locationNotFound'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
          else{
            this.map.setCenter({ lat: +data[0].lat, lng: +data[0].lan });
            this.onDeviceCnt = 0;
            this.offDeviceCnt = 0;
            this.stoppageDevCnt = 0;
            let d: Date = new Date();
            let device: DevicesInfo;
            this.devList = [];
            this.SortForAllLocation = 'all';
            this.sortBy = 'All'
            //let deviceNames: Array<DevicesInfo> = [];
            data.forEach(res => {
                timeDiff = (parseInt(d.getTime()/1000+"")) - +res.timestamp;
                // this.devicesList.forEach(dev => {
                //   if(dev.name == res.name){
                //     device = dev
                //   }
                // })
                if(res.type == 'Child'){
                  if(timeDiff < 300){
                    this.onDeviceCnt++;
                    icon = '../assets/Green_marker.png';
                    // device.liveStatusImg = '../assets/liveStatusOn.svg';/
                  }
                  else if(timeDiff>300){
                    this.offDeviceCnt++;
                    icon = '../assets/Red_marker.png';
                    // device.liveStatusImg = '../assets/liveStatusOff.svg';
                  }
                  else{
                    // device.liveStatusImg = '../assets/liveStatusExpire.svg';
                  }
                }
                else if(res.type == 'Car'){
                  //timeDiff is compared with 300seconds due to 5 mins interval
                    if(+res.speed > 0 && timeDiff<300){
                      icon = '../assets/GreenCar.png';
                      this.onDeviceCnt++;
                      // device.liveStatusImg = '../assets/liveStatusOn.svg';
                    }
                    else if(+res.speed == 0 && timeDiff<300){
                      icon = '../assets/BlueCar.png';
                      this.stoppageDevCnt++;
                      // device.liveStatusImg = '../assets/liveStatusStoppage.svg';
                    }
                    else if(timeDiff>300){
                      icon = '../assets/RedCar.png';
                      this.offDeviceCnt++;
                      // device.liveStatusImg = '../assets/liveStatusOff.svg';
                    }
                    else{
                      // device.liveStatusImg = '../assets/liveStatusExpire.svg';
                    }
                }
                else if(res.type == 'Pet'){
                  icon = '../assets/RedCar.png';
                  // device.liveStatusImg = '../assets/liveStatusOff.svg';
                }
                if(this.USAUser)
                  speed = (+res.speed*0.621371).toFixed(2)
                else
                  speed = parseInt(res.speed);
                dateTimestamp = parseInt(res.timestamp);
                devName = res.name;
                lat = +res.lat;
                lng= +res.lan;
                
                this.markers.push({
                  lat,
                  lng,
                  speed,
                  dateTimestamp,
                  devName,
                  icon
                })
              this.allLocations = this.markers;   
              console.log(" this.allLocations",  this.allLocations)            
              this.devList.push(device)
          })
            //this.devicesList = this.devList
            if(this.currUser.accSqliteEnable == 0){
              //this.offDeviceCnt = this.totalDevices - this.onDeviceCnt;
              this.loading =false;
              this.showInfoCard = true;
            }
            else{
              this.showStoppageDevices = true;
              this.loading = false;
              this.showInfoCard = true;
            }
            if(this.markers.length>20){
              this.showCluster = true;
            }
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

  fetchAddress(lat, lng){
    this.reportServ.getAddress(lat, lng)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: any) => {
          if(data.results[0]){
            this.address = data.results[0].formatted_address;
          }
          else{
            this.address = "Address not found";
          }
      },
      (error: any) => {
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'ServerError'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
    )
  }

  // getAddress(lat:number, lng:number){
  //   this.reportServ.getAddress(lat, lng)
  //     .takeUntil(this.ngUnsubscribe)
  //     .subscribe((data: any) => {
  //         if(data.results[0]){
  //           this.currAddress = data.results[0].formatted_address;
  //         }
  //         else{
  //           this.currAddress = "Address not found";
  //         }
  //     },
  //     (error: any) => {
  //       const dialogConfig = new MatDialogConfig();
  //       //pass data to dialog
  //       dialogConfig.data = {
  //         hint: 'ServerError'
  //       };
  //       const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
  //     }
  //   )
  // }

  getDevices(){
      this.loading = true;
      this.getDevice.getAllDeviceList(this.currUser.usrId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Array<DevicesInfo>) => {
          //console.log(data)
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
            localStorage.setItem('devicesList',JSON.stringify(data))
            this.devicesList = JSON.parse(localStorage.getItem('devicesList'))
            this.devList = this.devicesList
            // console.log("device lists", this.devList)
            this.userType = this.devicesList[0].type
            localStorage.setItem('userType',this.devicesList[0].type)
            if(this.devicesList.length>10){
              this.showSearchText = true;
              localStorage.setItem('showSearchText', this.showSearchText.toString())
            }
            this.loading = false;
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

  public sendInfo(devName:string,stud_id: number,chkExpiry,devType: string,showGoogleAdrs: string): void {
    this.selDeviceType = devType;
    this.showGoogleAddress = showGoogleAdrs;
    if(chkExpiry>=0){
      if (!stud_id) {
        return;
      }
      let input = {
        "event": "stop_track"
      } 
      this.liveLocServ.sendMsg(input);
      this.currLocation = [];
      this.liveLocation = [];
      let inputData =  {
        "event":"start_track",
        "student_id": +stud_id
      };
      // console.log("input ", inputData)
      this.liveLocServ.sendMsg(inputData);
      this.selDevice = devName;
    }
    else{
      const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                devName: devName,
                hint: 'SubscriptionExpire'
              };
      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
    }
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
        // this.getDevicesList(this.pId)

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
    this.devListss = []
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
    this.devListss = [];
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

  //call getDevicesList function on parent select
  optionClicked(event: Event, user: ParentUserList) {
    this.showAllbtn = true;
    this.getDevicesList(user.parentId);
    localStorage.setItem('ParentId', JSON.stringify(user.parentId));
  }

  getDevicesList(pId){
    this.devListss = []
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
          this.devListss = this.devicesListss;
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
      this.filteredDevices.next(this.devListss);
      // console.log("filteredlist", this.filteredDevices);
  
      // listen for search field value changes
      this.deviceFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterdevLists();
        });
    }
  
    protected filterdevLists() {
      if (!this.devListss) {
        return;
      }
      // get the search keyword
      let search = this.deviceFilterCtrl.value;
      if (!search) {
        this.filteredDevices.next(this.devListss.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the devices
      this.filteredDevices.next(
        this.devListss.filter(device => device.name.toLowerCase().indexOf(search) > -1)
      );
    }
  
    ngOnDestroy(): void{
      //console.log('ngOnDestroy called')
      this.wsServ.closeConnection()
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }

}
