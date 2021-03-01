import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskManagementService } from '../services/task-management.service';
import { MatDialog, MatDialogConfig, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { DriverEmpDetail } from '../core/driverEmpDetail.model';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import * as _moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ISO_FORMAT } from '../report/report.component';
import { UpdateTaskDialogComponent } from '../dialog/update-task-dialog/update-task-dialog.component';
import { CopyTaskViewDialogComponent } from '../dialog/copy-task-view-dialog/copy-task-view-dialog.component';

const moment = _moment;

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: ISO_FORMAT},
  ]
})
export class ViewTaskComponent implements OnInit {

  //spinner
  loading:boolean = true;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  viewTaskForm: FormGroup;
  minDate = moment().subtract(1, 'month')
  maxDate = moment();
  private ngUnsubscribe: Subject<any> = new Subject();
  empDetails: Array<DriverEmpDetail>;
  taskData: Array<any>;
  tasksDetails: Array<any> = [];
  tableHead: Array<any> = [];
  driverName: string;
  driverContact: number;

  constructor(private fb: FormBuilder,
              private taskServ: TaskManagementService,
              public dialog: MatDialog) { }

  ngOnInit() {
    //get emp details
    this.getEmpDetails()
    //form controls
    this.viewTaskForm = this.fb.group({
      empName: ['', Validators.required],
      startDate: [moment().startOf('week'), Validators.required],
      endDate: [moment().endOf('week'), Validators.required]
    })
  }

  get f() { return this.viewTaskForm.controls; }

  getEmpDetails(){
    this.loading = true
    //call service to fetch employee details
    this.taskServ.fetchEmployeeDetails()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((res: Array<DriverEmpDetail>) => {
      this.empDetails = res;
      this.loading = false;
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

  viewTask(){
    if(this.viewTaskForm.invalid)
      return
    else{
      this.tasksDetails = JSON.parse(localStorage.getItem('taskDetails'))
      this.driverName = this.f.empName.value.name
      this.driverContact = this.f.empName.value.mobileNo
      if(this.tasksDetails != null){
        this.taskData = this.tasksDetails.filter((res) => {
          return res.driverName == this.driverName
        })
        //console.log(this.taskData)
        if(this.taskData.length != 0)
          this.tableHead = ['Sr No','Vehicle Name', 'Start Time', 'Start Address', 'End Time', 'End Address','Edit','Delete']
        else{
          this.tableHead = []
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'NoTaskFound',
            driverNm: this.driverName
          };
          this.dialog.open(HistoryNotFoundComponent,dialogConfig);
        }
      }
      else{
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'NoTaskFound',
          driverNm: this.driverName
        };
        this.dialog.open(HistoryNotFoundComponent,dialogConfig);
      }
    }
  }

  updateTask(i){
    const dialogConfig = new MatDialogConfig();
    //pass data to dialog
    dialogConfig.data = {
      deviceName: this.taskData[i].deviceName,
      startTm: this.taskData[i].stTime,
      startAdrs: this.taskData[i].stAdrs,
      endTm: this.taskData[i].edTime,
      endAdrs: this.taskData[i].edAdrs
    };
    const updateData = this.dialog.open(UpdateTaskDialogComponent,{data: dialogConfig});
    updateData.afterClosed().subscribe((data) => {
      //console.log(data)
      if(data){
        this.taskData[i].deviceName = data.devName.name
        this.taskData[i].stTime = data.stTime
        this.taskData[i].stAdrs = data.stAdrs
        this.taskData[i].edTime = data.endTime
        this.taskData[i].edAdrs = data.endAdrs
      }
    })
  }

  deleteTask(i){
    this.taskData.splice(i,1)
  }

  copyTasks(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = this.taskData
    const copyTask = this.dialog.open(CopyTaskViewDialogComponent, dialogConfig);
    copyTask.afterClosed().subscribe((data) => {
      if(data){
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'taskCopied',
          driverNm: this.driverName
        };
        this.dialog.open(HistoryNotFoundComponent,dialogConfig);
      }
    })
  }

}
