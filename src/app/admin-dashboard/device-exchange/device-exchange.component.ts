
import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output, AfterViewInit,  OnDestroy  } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserDataService } from '../../services/user-data.service';
import { ParentUserList, GetExchangedDeviceList } from '../../core/post';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { onMainContentChange } from '../../core/animation';
import { SidenavService } from '../../services/sidenav.service';
import { BeatServiceService } from '../../services/beat-service.service';
import { Message } from 'src/app/core/message.model';
import { GetDeviceService } from '../../services/get-device.service';
import { NewStudentUpdateComponent } from '../new-student-update/new-student-update.component';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { ConfirmDeviceexcahngeComponent } from '../confirm-deviceexcahnge/confirm-deviceexcahnge.component';
import { ConfirmdevExBeatComponent } from '../confirmdev-ex-beat/confirmdev-ex-beat.component';
import { MatDialog, MatDialogConfig, MatTableDataSource} from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-device-exchange',
  templateUrl: './device-exchange.component.html',
  styleUrls: ['./device-exchange.component.css'],
  animations: [onMainContentChange,
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DeviceExchangeComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  public onSideNavChange: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  deviceFilterCtrl: FormControl = new FormControl();
  /** list of devices filtered by search keyword */
  public filteredDevices: ReplaySubject<DevicesInfo[]> = new ReplaySubject<DevicesInfo[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  studentExchangeForm: FormGroup;
  studentForm: FormGroup;
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
  tableHeader: Array<string> = ['name1','beforeDeviceId1','afterDeviceId1','beforDeviceSimNo1',
  'afterDeviceSimNo1', 'name2', 'beforeDeviceId2','afterDeviceId2'];
  expandedElement: any;
  dataSource :any = [];
  Data: MatTableDataSource<GetExchangedDeviceList>;
  parent_id: any;

  constructor(private dataService: UserDataService, 
    public dialog: MatDialog,
    private getDevice: GetDeviceService, 
    private _sidenavService: SidenavService,
    private beatService: BeatServiceService,
    public fb: FormBuilder, ) { 
      this._sidenavService.sideNavState$.subscribe( res => {
      this.onSideNavChange = res;
    }) 
  }

  ngOnInit() {
    this.studentExchangeForm = this.fb.group({
      'parentlist1': [''],
      'device1': ['', Validators.required],  
      'device2': ['', Validators.required],
      'checked': new FormControl(false)
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

  optionClicked(event: Event, user: ParentUserList) {
    this.getDevices(user.parentId);
    this.showButton = true;
    this.getDeviceExchangeList(user.parentId);
    localStorage.setItem('ParentId', JSON.stringify(user.parentId));
  }

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
      this.devList.filter(device => device.imei_no.toLowerCase().indexOf(search) > -1 || device.name.toLowerCase().indexOf(search) > -1)
    );
  }
  
  getdev: any = [];
  getDeviceExchangeList(parent_id) {
    this.loading = true;
    this.beatService.GetAllDeviceExchange(parent_id).subscribe((res: Array<GetExchangedDeviceList>)=> {
      this.loading = false;
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'NotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.getdev = res;
        this.Data = new MatTableDataSource<GetExchangedDeviceList>(res);
        this.dataSource = this.Data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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

  // exchange student
  onSubmit() {
    var parId = localStorage.getItem('ParentId');
    let devices = {
      devi1 : +this.studentExchangeForm.get('device1').value,
      devi2 : +this.studentExchangeForm.get('device2').value
    }
      var dev1 = +this.studentExchangeForm.get('device1').value
      var dev2 = +this.studentExchangeForm.get('device2').value
      
      if(this.studentExchangeForm.invalid) {
        return
      }
      else if(dev1 == dev2) {
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'InvalidStudent'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        // return
      } 
    else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = Object.assign(devices, this.studentExchangeForm.value);
        dialogConfig.maxWidth= "400px";
        let dialogRef = this.dialog.open(ConfirmDeviceexcahngeComponent, dialogConfig)
        .afterClosed().subscribe(dialogResult => {
          this.result = dialogResult;
          // this.getTable();
          this.studentExchangeForm.reset();
          this.getDeviceExchangeList(parId);
          // console.log("this.res", this.result)
        });
    } 
  }
  
  openDialog(): void {
    var parId = localStorage.getItem('ParentId');
    let dialogRef = this.dialog.open(NewStudentUpdateComponent, {
      width: '600px',
    }).afterClosed().subscribe((result) => {
      this.getDeviceExchangeList(parId);
    })
  }

  // exchange student name and beat both 
  exchangeBeatAndName() {
    var parId = localStorage.getItem('ParentId');
    let devices = {
      devi1 : +this.studentExchangeForm.get('device1').value,
      devi2 : +this.studentExchangeForm.get('device2').value
    }
      var dev1 = +this.studentExchangeForm.get('device1').value
      var dev2 = +this.studentExchangeForm.get('device2').value
      
      if(this.studentExchangeForm.invalid) {
        return
      }
      else if(dev1 == dev2) {
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'InvalidStudent'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        // return
      } 
    else {
      // open dialog to confirm
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = Object.assign(devices, this.studentExchangeForm.value);
        dialogConfig.maxWidth= "400px";
        let dialogRef = this.dialog.open(ConfirmdevExBeatComponent, dialogConfig)
        .afterClosed().subscribe(dialogResult => {
          this.result = dialogResult;
          // this.getTable();
          this.studentExchangeForm.reset();
          this.getDeviceExchangeList(parId);
          // console.log("this.res", this.result)
        });
    } 

  }

  reset() {
    this.studentExchangeForm.reset()
  }

  ngOnDestroy(): void{
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
