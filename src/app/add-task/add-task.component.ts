import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskManagementService } from '../services/task-management.service';
import { Subject } from 'rxjs';
import { DriverEmpDetail } from '../core/driverEmpDetail.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { DevicesInfo } from '../core/devicesInfo.model';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  //spinner
  loading:boolean = true;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  addTaskForm: FormGroup;
  private ngUnsubscribe: Subject<any> = new Subject();
  empDetails: Array<DriverEmpDetail>;
  deviceList: Array<DevicesInfo>;
  minDate: Date = new Date();
  startAdress: Array<any> = ['Bon Secore','CPEP','DMH','Cape Regional'];
  endAdress: Array<any> = ['AA Hospital', 'Joint Base', 'VA Hospital','GBMC Ex  Carts']
  tableHead: Array<string>;
  tasksInfo: Array<any> = JSON.parse(localStorage.getItem('taskDetails')) || []

  constructor(private fb: FormBuilder,
              private taskServ: TaskManagementService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.loading = true;
    //get emp details
    this.getEmpDetails()
    this.deviceList = JSON.parse(localStorage.getItem('devicesList'))
    //form controls
    this.addTaskForm = this.fb.group({
      empName: ['', Validators.required],
      deviceName: ['', Validators.required],
      startTime: ['', Validators.required],
      startAdrs: ['', Validators.required],
      endTime: ['', Validators.required],
      endAdrs: ['', Validators.required]
    })
    if(this.tasksInfo)
      this.tableHead = ['Driver Name','Vehicle Name','Start Date & Time', 'Start Address', 'End Date & Time', 'End Address','Delete']
    this.loading = false;
  }

  get f() { return this.addTaskForm.controls; }

  getEmpDetails(){
    //call service to fetch employee details
    this.taskServ.fetchEmployeeDetails()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((res: Array<DriverEmpDetail>) => {
      this.empDetails = res;
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

  addNewTask(){
    if(this.addTaskForm.invalid)
      return
    else{
      let driverName,deviceName,stTime,stAdrs,edTime,edAdrs;
      stTime = Math.floor(this.f.startTime.value._d.getTime()/1000)
      edTime = Math.floor(this.f.endTime.value._d.getTime()/1000)
      driverName = this.f.empName.value.name
      deviceName = this.f.deviceName.value.name
      stAdrs = this.f.startAdrs.value
      edAdrs = this.f.endAdrs.value
      this.tasksInfo.push({
        driverName,
        deviceName,
        stTime,
        stAdrs,
        edTime,
        edAdrs
      })
      localStorage.setItem('taskDetails',JSON.stringify(this.tasksInfo))
      //this.addTaskForm.reset()
    }
  }

  deleteTask(idx){
    this.tasksInfo.splice(idx,1)
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
