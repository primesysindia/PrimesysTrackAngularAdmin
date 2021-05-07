import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output, AfterViewInit,  OnDestroy  } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserDataService } from '../../services/user-data.service';
import { ParentUserList} from '../../core/post';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { onMainContentChange } from '../../core/animation';
import { SidenavService } from '../../services/sidenav.service';
import { BeatServiceService } from '../../services/beat-service.service';
import { Message } from 'src/app/core/message.model';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { MatDialog, MatDialogConfig, MatTableDataSource} from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GetDeviceService } from '../../services/get-device.service';
import { ConfirmDeviceUnregisterComponent } from '../confirm-device-unregister/confirm-device-unregister.component';
import { ConfirmDeviceRemoveComponent } from '../confirm-device-remove/confirm-device-remove.component';


@Component({
  selector: 'app-device-remove-unregister',
  templateUrl: './device-remove-unregister.component.html',
  styleUrls: ['./device-remove-unregister.component.css'],
  animations: [onMainContentChange,
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DeviceRemoveUnregisterComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  public onSideNavChange: boolean;

  deviceFilterCtrl: FormControl = new FormControl();
  /** list of devices filtered by search keyword */
  public filteredDevices: ReplaySubject<DevicesInfo[]> = new ReplaySubject<DevicesInfo[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  deviceForm: FormGroup;
  post: any;
  loading: boolean;
  parentId: any;
  parentData: any;
  parentList:Array<ParentUserList>;
  data: any;
  parentsLists: any;
  parentDataList: any;
  allPosts: any;
  parentlist = new FormControl();
  autoCompleteList: any[];
  currUser: any;
  result: any;
  showButton: boolean = false;
  devList: Array<DevicesInfo>;
  devicesListss: Array<DevicesInfo>;
  parent_id: any;
  imei: any;
  showBtnForAdmin: boolean = false;
  showBtnForSupport: boolean = false;

  constructor(private dataService: UserDataService, 
    public dialog: MatDialog,
    private getDevice: GetDeviceService, 
    private _sidenavService: SidenavService,
    private beatService: BeatServiceService,
    public fb: FormBuilder ) { 
      this._sidenavService.sideNavState$.subscribe( res => {
      this.onSideNavChange = res;
    }) 
  }
  ngOnInit() {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var roleId = userInfo.roleId;
    if( roleId == 20) {
      this.showBtnForAdmin = true;
      this.showBtnForSupport = false;
    }
    else if( roleId == 19) {
      this.showBtnForSupport = true;
      this.showBtnForAdmin = false;
    }
    this.deviceForm = this.fb.group({
      'parentlist1': [''],
      'device': ['', Validators.required]
    });
      this.getParentData();
  }

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

  optionClicked(event: Event, user: ParentUserList) {
    this.getDevices(user.parentId);
  }

  getDevices(pId){
    this.devList = [];
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
      this.devList.filter(device => device.imei_no.toLowerCase().indexOf(search) > -1 || device.name.toLowerCase().indexOf(search) > -1)
    );
  }

  onSelection(event: Event, device) {
    this.imei = device.imei_no;
  }

  deviceUnregister() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.data = this.imei;
    dialogConfig.data = {
      hint: 'DeviceUnregister',
      reqData: this.imei,
    };
    dialogConfig.width = '400px'
    let dialogRef = this.dialog.open(ConfirmDeviceUnregisterComponent, dialogConfig)
    .afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
    });
  }

  deviceRegister() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.data = this.imei;
    dialogConfig.data = {
      hint: 'DeviceRegister',
      reqData: this.imei,
    };
    dialogConfig.width = '400px'
    let dialogRef = this.dialog.open(ConfirmDeviceUnregisterComponent, dialogConfig)
    .afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
    });
  }

  deviceRemove() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.data = this.imei;
    dialogConfig.data = {
      hint: 'DeviceRemove',
      reqData: this.imei,
      // maxWidth: '400px'
    };
    dialogConfig.width = '400px'
    let dialogRef = this.dialog.open(ConfirmDeviceRemoveComponent, dialogConfig)
    .afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
    });
  }

}
