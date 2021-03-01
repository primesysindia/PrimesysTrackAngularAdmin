import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ViewTaskComponent } from 'src/app/view-task/view-task.component';

@Component({
  selector: 'app-copy-task-view-dialog',
  templateUrl: './copy-task-view-dialog.component.html',
  styleUrls: ['./copy-task-view-dialog.component.css']
})
export class CopyTaskViewDialogComponent implements OnInit {

  tasksDetail: Array<any> = [];
  tableHead = ['Sr No','Vehicle Name', 'Start Time', 'Start Address', 'End Time', 'End Address']
  driverName: string;

  constructor(private dialogRef: MatDialogRef<ViewTaskComponent>,
              @Inject(MAT_DIALOG_DATA) info) {
                //console.log(info)
                this.driverName = info[0].driverName
                this.tasksDetail = info
                this.tasksDetail.map((res) => {
                  res.stTime = res.stTime + (86400*7)
                  res.edTime = res.edTime + (86400*7)
                })
              }

  ngOnInit() {
  }

  copyTask(){
    let detail = JSON.parse(localStorage.getItem('taskDetails'))
    this.tasksDetail.forEach((res) =>{
      detail.push(res)
    })
    localStorage.setItem('taskDetails', JSON.stringify(detail))
    let data = 'task copied';
    this.dialogRef.close(data);
  }

  ngOnDestroy(): void {
    this.tasksDetail.map((res) => {
      res.stTime = res.stTime - (86400*7)
      res.edTime = res.edTime - (86400*7)
    }) 
  }

}
