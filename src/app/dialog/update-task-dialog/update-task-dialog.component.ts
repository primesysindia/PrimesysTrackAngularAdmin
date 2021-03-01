import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { ViewTaskComponent } from 'src/app/view-task/view-task.component';
import { DevicesInfo } from 'src/app/core/devicesInfo.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { ISO_FORMAT } from 'src/app/report/report.component';
const moment = _moment;

@Component({
  selector: 'app-update-task-dialog',
  templateUrl: './update-task-dialog.component.html',
  styleUrls: ['./update-task-dialog.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: ISO_FORMAT},
  ]
})
export class UpdateTaskDialogComponent implements OnInit {
  
  updateTaskForm: FormGroup;
  deviceList: Array<DevicesInfo> = JSON.parse(localStorage.getItem('devicesList'))
  d: Date = new Date()
  minDate: Date = new Date(this.d.getFullYear(),this.d.getMonth()-1,this.d.getDate());
  startAdress: Array<any> = ['Bon Secore','CPEP','DMH','Cape Regional'];
  endAdress: Array<any> = ['AA Hospital', 'Joint Base', 'VA Hospital','GBMC Ex  Carts']
  deviceName: string;
  startTime: any;
  startAddress: string;
  endTime: any;
  endAddress: string;

  constructor(private formBuilder: FormBuilder,
      private dialogRef: MatDialogRef<ViewTaskComponent>,
      @Inject(MAT_DIALOG_DATA) info) {
      this.deviceName = info.data.deviceName
      this.startTime = moment(info.data.startTm*1000)
      this.startAddress = info.data.startAdrs
      this.endTime = moment(info.data.endTm*1000)
      this.endAddress = info.data.endAdrs
     }

  ngOnInit() {
    this.deviceList = JSON.parse(localStorage.getItem('devicesList'))
    let driver = this.deviceList.find((res) => {
      return res.name == this.deviceName
    })
    this.updateTaskForm = this.formBuilder.group({
      deviceName: [driver, Validators.required],
      startTime: [this.startTime, Validators.required],
      startAddress: [this.startAddress, Validators.required],
      endTime: [this.endTime, Validators.required],
      endAddress: [this.endAddress, Validators.required]
    })
  }

  get f() { return this.updateTaskForm.controls; }

  updateTask(task){
    //console.log(task.value)
    let data = {
      devName: task.value.deviceName,
      stAdrs: task.value.startAddress,
      stTime: Math.floor(task.value.startTime._d.getTime()/1000),
      endAdrs: task.value.endAddress,
      endTime: Math.floor(task.value.endTime._d.getTime()/1000)    
    }
    this.dialogRef.close(data);
  }

}
