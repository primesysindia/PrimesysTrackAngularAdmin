import { Component, OnInit } from '@angular/core';
import { TaskManagementService } from '../services/task-management.service';
import { MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { DriverEmpDetail } from '../core/driverEmpDetail.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css']
})
export class ManageEmployeeComponent implements OnInit {

  addNewEmp:boolean = false;
  colNames: string[] = ['empName', 'mobileNo', 'emailId', 'address', 'gender', 'edit'];
  empData: MatTableDataSource<DriverEmpDetail> = new MatTableDataSource<DriverEmpDetail>();
  //spinner
  loading:boolean = true;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private taskMng: TaskManagementService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.getEmployeeDetails();
  }

  addNewEmployee(){
    this.addNewEmp = true;
  }

  getEmployeeDetails(){
    this.loading = true;
    this.taskMng.fetchEmployeeDetails()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: MatTableDataSource<DriverEmpDetail>) =>{
        this.empData = data;
        this.loading = false;
      },
      (error) =>{
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'ServerError'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      })
  }

  editEmpInfo(){

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
