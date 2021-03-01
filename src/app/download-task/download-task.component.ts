import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
const moment = _moment;

@Component({
  selector: 'app-download-task',
  templateUrl: './download-task.component.html',
  styleUrls: ['./download-task.component.css']
})
export class DownloadTaskComponent implements OnInit {

  tasksInfo: Array<any>;
  uniqueDriverName: Array<string>;
  uniqueDeviceName: Array<string>;
  taskDetails: Array<any> = [];
  weekDates: Array<any>;

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.tasksInfo = JSON.parse(localStorage.getItem('taskDetails'))
    this.uniqueDriverName = [...Array.from(new Set(this.tasksInfo.map(item => item.driverName)))]
    this.uniqueDeviceName = [...Array.from(new Set(this.tasksInfo.map(item => item.deviceName)))]
    this.uniqueDriverName.forEach(driver => {
      let driverName = driver
      this.uniqueDeviceName.forEach(device =>{
        let deviceName = device
        let obj = []
        for(let task of this.tasksInfo){
          if(task.driverName == driver && task.deviceName == device){
            obj.push({
              stTime: task.stTime,
              stAdrs: task.stAdrs,
              edTime: task.edTime,
              edAdrs: task.edAdrs
            })
          }
        }
        if(obj.length !== 0){
          this.taskDetails.push({
            driverName: driverName,
            deviceName: deviceName,
            tasks: obj
          })
        }
      })
    })
    this.taskDetails.forEach(data => {
      let obj1 = [], obj2 = [], obj3 = [], obj4 = [], obj5 = [], obj6 = [], obj7 = [];
      obj1 = data.tasks.filter((res) => {
        return this.datePipe.transform(res.stTime*1000, 'EEE') == 'Mon'
      })
      obj2 = data.tasks.filter((res) => {
        return this.datePipe.transform(res.stTime*1000, 'EEE') == 'Tue'
      })
      obj3 = data.tasks.filter((res) => {
        return this.datePipe.transform(res.stTime*1000, 'EEE') == 'Wed'
      })
      obj4 = data.tasks.filter((res) => {
        return this.datePipe.transform(res.stTime*1000, 'EEE') == 'Thu'
      })
      obj5 = data.tasks.filter((res) => {
        return this.datePipe.transform(res.stTime*1000, 'EEE') == 'Fri'
      })
      obj6 = data.tasks.filter(res => {
        return this.datePipe.transform(res.stTime*1000, 'EEE') == 'Sat'
      })
      obj7 = data.tasks.filter(res => {
        return this.datePipe.transform(res.stTime*1000, 'EEE') == 'Sun'
      })
      if(obj1.length == 0){
        obj1.push('OFF')
      }
      if(obj2.length == 0){
        obj2.push('OFF')
      }
      if(obj3.length == 0){
        obj3.push('OFF')
      }
      if(obj4.length == 0){
        obj4.push('OFF')
      }
      if(obj5.length == 0){
        obj5.push('OFF')
      }
      if(obj6.length == 0){
        obj6.push('OFF')
      }
      if(obj7.length == 0){
        obj7.push('OFF')
      }
      data.tasks = []
      data.tasks.push(obj1)
      data.tasks.push(obj2)
      data.tasks.push(obj3)
      data.tasks.push(obj4)
      data.tasks.push(obj5)
      data.tasks.push(obj6)
      data.tasks.push(obj7)
    })
    this.weekDates = [moment().startOf('week'),moment().startOf('week').add(1,'day'),moment().startOf('week').add(2,'day'),moment().startOf('week').add(3,'day'),moment().startOf('week').add(4,'day'),moment().startOf('week').add(5,'day'),
                      moment().startOf('week').add(6,'day')];
    console.log(this.weekDates)
    console.log(this.taskDetails)
  }

}
