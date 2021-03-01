import { Component, OnInit, Inject, ViewChild, ElementRef,EventEmitter,Output, AfterViewInit,  OnDestroy  } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { KeyManBeatList } from '../../core/post';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BeatServiceService } from '../../services/beat-service.service';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { Message } from 'src/app/core/message.model';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { GetDeviceService } from '../../services/get-device.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-new-student-update',
  templateUrl: './new-student-update.component.html',
  styleUrls: ['./new-student-update.component.css']
})
export class NewStudentUpdateComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public event: EventEmitter<any> = new EventEmitter();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  public deviceFilterCtrl: FormControl = new FormControl();
  /** list of devices filtered by search keyword */
  public filteredDevices: ReplaySubject<DevicesInfo[]> = new ReplaySubject<DevicesInfo[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  updateNewStudent: FormGroup;
  parentId: any;
  devList: Array<DevicesInfo>;
  devicesListss: Array<DevicesInfo>;
  student: any;
  imeiNo: any;
  loading: boolean;

  constructor( public dialogRef: MatDialogRef<NewStudentUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private getDevice: GetDeviceService, 
    private beatService: BeatServiceService, public dialog: MatDialog,
    private fb: FormBuilder) { }


  ngOnInit() {
    this.parentId = JSON.parse(localStorage.getItem('ParentId')),
    this.updateNewStudent = this.fb.group({
      'studentId': ['', Validators.required],
      'name': ['', Validators.required],
      'imei_no': ['', Validators.required],
      'simNo': ['', Validators.required]
    })
    this.getDevices(this.parentId)
  }

  getDevices(pId){
    this.getDevice.getAllDeviceList(pId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: Array<DevicesInfo>) => {
      //  console.log("data", data)
        if(data.length == 0){
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
    this.student = student.student_id;
    this.imeiNo = student.imei_no;
    console.log("student", this.student)
      localStorage.setItem('StudentID', this.student);
  }

  updateStudent() {
    let devices = {
      device1: +this.student
    }
    if (this.updateNewStudent.invalid) {
      return
    } else {
      this.loading = true;
      this.beatService.updateNewDeviceName(Object.assign(devices, this.updateNewStudent.value))
          .takeUntil(this.ngUnsubscribe)
          .subscribe((data: Message)=>{
            // console.log("data", data)
            if(data.error == "true"){
              this.loading = false;
              this.dialogRef.close();
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'StudentNotAdded'
              };
              const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
            }
            else {
              this.dialogRef.close();
              this.loading = false;
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'StudentAdded'
              };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
       })
    }
  }
  onNoClick() {
    this.dialogRef.close()
  }

  resetForm() {
    this.updateNewStudent.reset();
  }

  ngOnDestroy(): void{
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
