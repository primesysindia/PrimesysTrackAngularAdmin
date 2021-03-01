import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/core/errorChk.error-matcher';
import { DevicesInfo } from 'src/app/core/devicesInfo.model';
import { TaskManagementService } from 'src/app/services/task-management.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { Message } from 'src/app/core/message.model';
import { ManageEmployeeComponent } from '../manage-employee.component';
import { Subject } from 'rxjs';

export const errorMessages: { [key: string]: string } = {
  email: 'Please enter valid email address',
  mobileNo: 'Please enter valid mobile number of 10 digits'
};

@Component({
  selector: 'app-add-emp',
  templateUrl: './add-emp.component.html',
  styleUrls: ['./add-emp.component.css']
})
export class AddEmpComponent implements OnInit {
  
  addEmpForm: FormGroup;
  errors = errorMessages;
  matcher: MyErrorStateMatcher;
  disable: boolean = true;
  deviceList: Array<DevicesInfo>;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(public fb: FormBuilder,
              private taskMng: TaskManagementService,
              public dialog: MatDialog,
              public MngEmp: ManageEmployeeComponent) {
    this.matcher = new MyErrorStateMatcher();
  }

  ngOnInit() {
    this.addEmpForm = this.fb.group({
      empName: ['', Validators.required],
      mobileNo: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['male'],
      username: [{value: '', disabled : true}],
      vehicleName: ['', Validators.required]
    })
    this.onChanges()
    this.deviceList = JSON.parse(localStorage.getItem('devicesList'))
  }

  get f() { return this.addEmpForm.controls; }

  onChanges() {
    this.addEmpForm.get('email').valueChanges
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data) => {
      this.f.username.setValue(data)
    })
  }

  resetForm(){
    this.addEmpForm.reset();
  }

  saveNewEmp(){
    if(this.addEmpForm.invalid)
      return
    else{
      this.taskMng.addNewEmployee(this.addEmpForm.value)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          if(data.error == "true"){
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'EmpNotAdded'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
          else{
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'EmpAdded'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
        },
        (err) => {
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'ServerError'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        })
    }
  }

  goBack(){
    this.MngEmp.addNewEmp = false;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
