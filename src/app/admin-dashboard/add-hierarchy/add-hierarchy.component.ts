import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { GetDeviceService } from '../../services/get-device.service';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { UserDataService } from '../../services/user-data.service';
import { Message } from 'src/app/core/message.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { getHierarchyData, deptHierachyName } from '../../core/post';

@Component({
  selector: 'app-add-hierarchy',
  templateUrl: './add-hierarchy.component.html',
  styleUrls: ['./add-hierarchy.component.css']
})
export class AddHierarchyComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public event: EventEmitter<any> = new EventEmitter();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  dept: any;
  addHierarchyForm: FormGroup;
  parentId: any;
  devList: Array<DevicesInfo>;
  devicesListss: Array<DevicesInfo>;
  loading: boolean= true;
  isDevice: boolean = false;
  allPosts: any;
  hierarchyData: any;

  constructor( public dialogRef: MatDialogRef<AddHierarchyComponent>,
    @Inject(MAT_DIALOG_DATA) public mdata: any,  private beatService: BeatServiceService,
   public dialog: MatDialog, private fb: FormBuilder, private getDevice: GetDeviceService, private dataService: UserDataService) { }

  ngOnInit() {
    this.parentId = JSON.parse(localStorage.getItem('ParentId')),

    this.addHierarchyForm = this.fb.group({
      'deptName': ['', Validators.required],
      'emailId': ['', [Validators.required, Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      'mobileNo': ['', Validators.required],
      'deptId': ['', Validators.required],
      'deptParentId': ['', Validators.required],
      'studentsNo': this.fb.array([]),
    })
    this.getParentData();
  }

  get f() { return this.addHierarchyForm.controls; }

  public hasError = (controlName: string, errorName: string) =>{
    return this.addHierarchyForm.controls[controlName].hasError(errorName);
  }

  getDeptName() {
    this.loading = true;
    this.beatService.GetDepartment().takeUntil(this.ngUnsubscribe)
    .subscribe((data: Array<deptHierachyName>)=> {
      if(data.length == 0){
        // this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'hierachyDataNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } 
      else {
      this.loading = false;
      this.dept = data
      // console.log("dept", this.dept)
      this.getDevices(this.parentId)
      }
    })
  }

  getParentData() {
    this.loading = true;
    this.dataService.getAllParentId().takeUntil(this.ngUnsubscribe)
    .subscribe((data: any) => {
      if(!data){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'NoParentList'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
      else {
        this.allPosts = data;
        this.getDeptName();
        // console.log("this.parentUser", this.allPosts)
        // this.getDevices(this.pId)
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

  GetRailwayDeptHierarchy(parentId) {
    this.loading = true;
    this.beatService.GetRailwayDepHierarchy(parentId).subscribe((res: Array<getHierarchyData>)  => {
      this.loading = false;
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'depHieNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } 
      else {
        this.loading = false;
        this.hierarchyData = res;
        // console.log("datasorce", this.hierarchyData)
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

  getDevices(pId) {
    this.devList = []
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
          this.GetRailwayDeptHierarchy(this.parentId)
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

    changeDeviceByCategory(event) {
      if (this.isDevice) {
        event.target.checked = true
      }
     
      const formArray: FormArray = this.addHierarchyForm.get('studentsNo') as FormArray;
      if(event.target.checked){
        // Add a new control in the arrayForm
        formArray.push(new FormControl(event.target.value.toString()));
      }
     
      /* unselected */
      else{
        // find the unselected element
        let i: number = 0;
        formArray.controls.forEach((ctrl: FormControl) => {
          if(ctrl.value == event.target.value) {
            // Remove the unselected element from the arrayForm
            formArray.removeAt(i);      
            return;
          }
          i++;
        });
      }
    }

  saveHierarchyForm(input: FormData) {
    const formArray: FormArray = this.addHierarchyForm.get('studentsNo') as FormArray;
    // convert array to comma separated string before sending to api
    let studentsNumber = {
      studentsList : formArray.value.toString()
    }
    if(this.addHierarchyForm.invalid) {
      return
    } else {
        this.loading = true;
        this.beatService.saveHierarchy(Object.assign(studentsNumber, this.addHierarchyForm.value))
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          // console.log("data", data)
          if(data.error == "true"){
            this.loading = false;
            this.dialogRef.close();
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'HierarchyNotAdded'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          } else {
            this.loading = false;
            this.dialogRef.close()
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'HierarchyAdded'
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
      })
      }
    }

  resetForm(){
    this.addHierarchyForm.reset();
  }

  onNoClick() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
