import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output, AfterViewInit,  OnDestroy  } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserDataService } from '../../services/user-data.service';
import { ParentUserList, InspectionData} from '../../core/post';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { SidenavService } from '../../services/sidenav.service';
import { BeatServiceService } from '../../services/beat-service.service';
import { Message } from 'src/app/core/message.model';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { MatDialog, MatDialogConfig, MatTableDataSource} from '@angular/material';
import { GetDeviceService } from '../../services/get-device.service';
import { DatePipe } from '@angular/common';
import { EditInspectionFormComponent } from '../edit-inspection-form/edit-inspection-form.component';
import { MatPaginator } from '@angular/material/paginator';
import { ExcelServiceService } from '../../services/excel-service.service';

@Component({
  selector: 'app-onsite-inspection-form',
  templateUrl: './onsite-inspection-form.component.html',
  styleUrls: ['./onsite-inspection-form.component.css']
})
export class OnsiteInspectionFormComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  public onSideNavChange: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  deviceFilterCtrl: FormControl = new FormControl();
  /** list of devices filtered by search keyword */
  public filteredDevices: ReplaySubject<DevicesInfo[]> = new ReplaySubject<DevicesInfo[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
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
  deviceNo: any;
  inspectionForm: FormGroup;
  dataSource :any = [];
  responseData: any;
  recievedData: MatTableDataSource<InspectionData>;
  tableHeader: Array<string> = ['deviceNo','issueTitle', 'issueDesp','finalReport', 'contactPerson','inspectedBy', 'action'];

  constructor(private dataService: UserDataService, 
    public dialog: MatDialog,
    private getDevice: GetDeviceService, 
    private _sidenavService: SidenavService,
    private beatService: BeatServiceService,
    public fb: FormBuilder, public datepipe: DatePipe,
    private excelServ: ExcelServiceService) { }

  ngOnInit() {
    this.inspectionForm = this.fb.group({
      'parentlist': [''],
      'device': ['', Validators.required],
      'issueTitle': ['', Validators.required],
      'issueDesc': ['', Validators.required],
      'finalReport': ['', Validators.required],
      'contactPerson': ['', Validators.required],
      'inspectedBy': ['', Validators.required],
      'InspectionDate': ['', Validators.required]
    });
    this.getParentData();
    this.getInspectionData();
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
    this.deviceNo = device.student_id;
    // console.log(this.deviceNo)
  }

  submit() {
    // console.log(this.inspectionForm.value)
    let param = {
      actDate: this.datepipe.transform(this.inspectionForm.get('InspectionDate').value, 'MM-dd-yyyy'),
      deviceNo: this.deviceNo
    }
    this.loading = true;
      this.beatService.saveInspectionForm(Object.assign(param, this.inspectionForm.value))
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          // console.log("data", data)
          if(data.error == "true"){
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'DataNotAdded'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          } else {
            this.loading = false;
            // this.dialogRef.close()
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'DataAdded',
              ticketId: data.id
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig);
          this.getInspectionData();
          }
        })
  }

  getInspectionData() {
    this.loading = true;
    this.beatService.getInspectionData().subscribe((res: Array<InspectionData>)=> {
      this.loading = false;
      // console.log(res)
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'DataNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.responseData = res;
        this.recievedData = new MatTableDataSource<InspectionData>(res);
        this.dataSource = this.recievedData;
        this.dataSource.paginator = this.paginator;
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

  openEditDialog(data): void {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '600px';
      // dialogConfig.data = res;
      dialogConfig.data = {
       data: data
      };
      // console.log("id",dialogConfig.data)

      let dialogRef = this.dialog.open(EditInspectionFormComponent, dialogConfig)
      .afterClosed().subscribe((result) => {
        this.getInspectionData();
      })
  // })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  downloadFile(){
    this.excelServ.generateInspectionHistoryExcel(this.responseData,this.tableHeader)
  }

}
