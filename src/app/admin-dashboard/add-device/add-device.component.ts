import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output ,AfterViewInit,  OnDestroy } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import * as XLSX from 'xlsx';
import { BeatServiceService } from '../../services/beat-service.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { userList } from '../../core/devicesInfo.model';
import { DatePipe } from '@angular/common';
import { AddDeviceConfirmComponent } from '../add-device-confirm/add-device-confirm.component';
import { MultipleDeviceConfirmComponent } from '../multiple-device-confirm/multiple-device-confirm.component';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public userFilterCtrl: FormControl = new FormControl();
  /** list of devices filtered by search keyword */
  public filteredUsers: ReplaySubject<userList[]> = new ReplaySubject<userList[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  file: File;
  arrayBuffer: any;
  filelist: any;
  loading: boolean;
  response: any;
  deviceType: any;
  addDeviceFor: any;
  userList: any;
  paymentPlanList: any;
  excelUrl: string = 'http://primesystech.com/PrimesysTrackReport/TemplatesFiles/AddBulkDevice_template.xlsx'
  paymentModeList: any;
  addSingleDeviceForm: FormGroup;
  bulkDeviceAddition: FormGroup;
  parentId: any;
  fetchedData: any = [];

  constructor(private fb: FormBuilder, public datepipe: DatePipe,
    private beatService: BeatServiceService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.addSingleDeviceForm = this.fb.group({
      parentId: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      DeviceID: ['', Validators.required],
      Type: ['', Validators.required],
      DeviceType: ['', Validators.required],
      DeviceSimNumber :['', Validators.required],
      ActivationDate: ['', Validators.required],
      PlanTypeID: ['', Validators.required],
      PaymentMode: ['', Validators.required],
      PaymentDate: ['', Validators.required],
      TransactionID: ['', Validators.required],
      PayAmount: ['', Validators.required],
      simImeiNo: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(20)]],
      isRailwayUser: new FormControl(false)
    })

    this.bulkDeviceAddition = this.fb.group({
      parentId: ['', Validators.required],
      Type: ['', Validators.required],
      DeviceType: ['', Validators.required],
      ActivationDate: ['', Validators.required],
      PlanTypeID: ['', Validators.required],
      PaymentMode: ['', Validators.required],
      PaymentDate: ['', Validators.required],
      TransactionID: ['', Validators.required],
      PayAmount: ['', Validators.required],
      file: ['', Validators.required],
      isRailwayUser: new FormControl(false)
    })
    this.getDataListForDevice();
  }

  getDataListForDevice() {
    this.loading = true;
    this.beatService.GetAddDeviceDropDownInfo()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data: any)=> {
      // console.log("ressp",data)
      if(data.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'IssuelistNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.loading = false;
        this.deviceType = data.deviceTypeList;
        this.addDeviceFor = data.deviceTypeList;
        this.userList = data.userList;
        this.paymentPlanList = data.paymentPlanList;
        this.paymentModeList = data.paymentmodeList;
        this.userFilter();
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

  userFilter() {
    // load the initial device list
    this.filteredUsers.next(this.userList);
    // console.log("filteredlist", this.filteredDevices);

    // listen for search field value changes
    this.userFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterdevLists();
      });
  }

  protected filterdevLists() {
    if (!this.userList) {
      return;
    }
    // get the search keyword
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUsers.next(this.userList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the devices
    this.filteredUsers.next(
      this.userList.filter(user => user.Name.toLowerCase().indexOf(search) > -1)
    );
  }

  addfile(event)     
  {    
    this.file= event.target.files[0];     
    let fileReader = new FileReader();    
    fileReader.readAsArrayBuffer(this.file);     
    fileReader.onload = (e) => {    
        this.arrayBuffer = fileReader.result;    
        var data = new Uint8Array(this.arrayBuffer);    
        var arr = new Array();    
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
        var bstr = arr.join("");    
        var workbook = XLSX.read(bstr, {type:"binary"});    
        var first_sheet_name = workbook.SheetNames[0];    
        var worksheet = workbook.Sheets[first_sheet_name];    
        console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));    
          var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});
          this.fetchedData = XLSX.utils.sheet_to_json(worksheet,{raw:true});
          // console.log("arraylist", arraylist)
              this.filelist = [];    
              console.log(this.fetchedData)    
    }    
  }    

  onSelection(event: Event, user) {
    this.parentId = user.parentId;
  }

  saveSingleDevice() {
    let param = {
      actDate: this.datepipe.transform(this.addSingleDeviceForm.get('ActivationDate').value, 'MM-dd-yyyy'),
      payDate: this.datepipe.transform(this.addSingleDeviceForm.get('PaymentDate').value, 'MM-dd-yyyy'),
    }
    // console.log(this.addSingleDeviceForm.value)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      width: '350px',
      params: param,
      data: this.addSingleDeviceForm.value
  };
    let dialogRef = this.dialog.open(AddDeviceConfirmComponent, dialogConfig)
   .afterClosed().subscribe(dialogResult => {
   });

    // this.beatService.addSingleDevice(Object.assign(param, this.addSingleDeviceForm.value))
    // .takeUntil(this.ngUnsubscribe)  
    // .subscribe((data)=>{
    //   console.log("data", data);
    // })
  }
  
  saveMultipleDevice() {
    let param = {
      actDate: this.datepipe.transform(this.bulkDeviceAddition.get('ActivationDate').value, 'MM-dd-yyyy'),
      payDate: this.datepipe.transform(this.bulkDeviceAddition.get('PaymentDate').value, 'MM-dd-yyyy'),
      bulkData:  JSON.stringify((this.fetchedData))
    }
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      width: '350px',
      params: param,
      data: this.bulkDeviceAddition.value
  };
    let dialogRef = this.dialog.open(MultipleDeviceConfirmComponent, dialogConfig)
    .afterClosed().subscribe(dialogResult => {
    });
    // this.beatService.addMultipleDevice(Object.assign(param,this.bulkDeviceAddition.value))
    // .takeUntil(this.ngUnsubscribe)  
    // .subscribe((data)=>{
    //   console.log("data", data);
    // })
  }

  reset() {
    this.bulkDeviceAddition.reset();
  }

  cancel() {
    this.addSingleDeviceForm.reset();
  }







































  // onFileChange(ev) { 
  //   let workBook = null;
  //   let jsonData = null;
  //   const reader = new FileReader();
  //   const file = ev.target.files[0];
  //   reader.onload = (event) => {
  //     const data = reader.result;
  //     workBook = XLSX.read(data, { type: 'binary' });
  //     jsonData = workBook.SheetNames.reduce((initial, name) => {
  //       const sheet = workBook.Sheets[name];
  //       initial[name] = XLSX.utils.sheet_to_json(sheet);
  //       return initial;
  //     }, {});
  //     const dataString = JSON.stringify(jsonData);
  //     console.log("dta", dataString)
  //     // document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
  //     // this.setDownload(dataString);
  //   }
  //   reader.readAsBinaryString(file);
  // }

//   onFileChange(files) {
//     if (files && files.length > 0) {
//         const file: File = files.item(0);
//         const reader: FileReader = new FileReader();
//         reader.readAsText(file);
//         reader.onload = (e) => {
//             const res = reader.result as string; // This variable contains your file as text
//             const lines = res.split('\n'); // Splits you file into lines
//             const ids = [];
//             lines.forEach((line) => {
//                 ids.push(line.split(',')[0]); // Get first item of line
//             });
//             console.log(ids);
//         };
//     }
// }

}
