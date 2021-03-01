import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { ParentUserList, GetPaymentDetailsInfo } from '../../core/post';
import { GetDeviceService } from '../../services/get-device.service';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogConfig, MatDialogRef, MatRadioChange, MatTableDataSource } from '@angular/material';
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
import { Message } from 'src/app/core/message.model';
// import { Observable, of, timer } from 'rxjs';
import { Observable } from 'rxjs/Rx'

@Component({
  selector: 'app-device-payment',
  templateUrl: './device-payment.component.html',
  styleUrls: ['./device-payment.component.css'],
  animations: [ onMainContentChange ]
})
export class DevicePaymentComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  devicePaymentForm: FormGroup;
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
  autoCompleteList: any[];
  public onSideNavChange: boolean;
  showCheckboxError: boolean;
  devs: any; 
  paymentData: any;
  showPaymntType: boolean = false; 
  deviceData:any;
  deviceName: any;
  allDevices: any=[];
  parID: any;
  usrId: any;
  usrDetail: any;
  dataSource: any = [];
  devicessData: any = [];
  showPaymentTable: boolean = false;
  paymentDetails: MatTableDataSource<GetPaymentDetailsInfo>;
  tableHeader: Array<string> = ['Device_name', 'IMEI_No', 'Device_SimNo', 'Plan_Type', 'LastPaymentDate', 
                                'ExpiryDate', 'DeviceStatus', 'RemainingDays'];
  showPagination: boolean = true;

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  
  constructor(private dataService: UserDataService, 
    private getDevice: GetDeviceService,
    public dialog: MatDialog,
    private _sidenavService: SidenavService,
    private liveLocServ: LiveLocationService, 
    public fb: FormBuilder, 
    private wsServ: WebsocketService,
    private beatService: BeatServiceService
    ) { 
      this._sidenavService.sideNavState$.subscribe( res => {
      this.onSideNavChange = res;
    })
  }

  ngOnInit() {
    this.usrDetail = JSON.parse(localStorage.getItem('currentUserInfo'))
    this.usrId = this.usrDetail.usrId;
    this.getParentData();
    this.devicePaymentForm = this.fb.group({
      parentlist: [''],
      paymentType: ['', Validators.required],
      currentStatus: ['', Validators.required],
      // devlistsArr: this.fb.array([]),
      devlistsArr: new FormArray([])
    })

  }

   // Shorten for the template
   get devlistsFormArr () {
    return this.devicePaymentForm.controls.devlistsArr as FormArray;
  }

  getParentData() {
    this.devList = [];
    this.devicessData = [];
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
    this.devicessData= [];
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
    const arr = this.devicePaymentForm.controls.devlistsArr as FormArray;
    while (0 !== arr.length) {
      arr.removeAt(0);
    }
    this.devList = [];
    this.dataSource = [];
    this.devicessData = [];
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
    this.parID = user.parentId;
    this.getDevices(user.parentId);
    this.getPaymentType(this.usrId);
    localStorage.setItem('ParentId', JSON.stringify(user.parentId));
  }

  // get all payment list info
  getPaymentInfo(pId) {
    this.beatService.getPaymentDetails(pId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((res: Array<GetPaymentDetailsInfo>) => {
      this.loading = false;
      // this.showPaymentTable = true;
      // console.log(res)
      if(res.length>10){
        this.showPagination = false;
      }
      this.paymentDetails = new MatTableDataSource<GetPaymentDetailsInfo>(res);
      this.dataSource = this.paymentDetails;
      this.paymentDetails.paginator = this.paginator;
      this.paymentDetails.filterPredicate = function(data, filter: string): boolean {
        return data.FullName.toLowerCase().includes(filter)
      };
    },(err) => {
      this.loading = false;
        const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'ServerError'
            };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
    })
    this.loading = false;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.paymentDetails.filter = filterValue;
    
    if (this.paymentDetails.paginator) {
      this.paymentDetails.paginator.firstPage();
    }
  }


  // get devices/students list
   getDevices(pid){
    this.devList = [];
    this.devicessData = [];
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
          this.devicessData = data;
          this.showCheckboxError = true;
          this.showAllFields = true;
          this.getPaymentInfo(pid);
          this.addCheckboxes();
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

  // get payment type for user api call
    getPaymentType(usrId) {
      this.beatService.GetDevicePaymentType(usrId)
       .takeUntil(this.ngUnsubscribe)
      .subscribe((data) => {
        this.showPaymntType = true;
        this.paymentData = data;
      })
    }
   
    private addCheckboxes() {
      // this.devicessData = [];
      this.devicessData.forEach(() => this.devlistsFormArr.push(new FormControl(false)));
    }

    // check all checkboxes
    checkAll() {
      this.devlistsFormArr.controls.map(value => value.setValue(true))
    }
   
    // uncheck all checkboxes
   deselectAll() {
     this.devlistsFormArr.controls.map(value => value.setValue(false))
   }
   
  //  save payment
    submit() {
      this.allDevices = this.devicePaymentForm.value.devlistsArr
      .map((checked, i) => checked ? this.devicessData[i].student_id : null)
      .filter(v => v !== null);
      // console.log(this.allDevices);

     let pType = this.devicePaymentForm.get('paymentType').value;
     let status = this.devicePaymentForm.get('currentStatus').value;

      let studentsNumber = {
        studentsList : this.allDevices.toString(),
        pId:  this.parID
      }

      if(this.devicePaymentForm.invalid) {
        return
      } else {
        this.loading = true;
        this.beatService.MultipleDevicePayment(Object.assign(studentsNumber, this.devicePaymentForm.value))
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          // console.log("data", data)
          if(data.error == "true"){
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'PaymentNotDone'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          } else {
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'PaymentDone'
            };
            this.getPaymentInfo(this.parID)
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
      })
      }
    }
}