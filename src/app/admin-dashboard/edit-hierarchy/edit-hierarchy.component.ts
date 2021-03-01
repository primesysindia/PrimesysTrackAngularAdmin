import { Component, OnInit, EventEmitter, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { getHierarchyData, deptHierachyName } from '../../core/post';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { GetDeviceService } from '../../services/get-device.service';
import { Message } from 'src/app/core/message.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-edit-hierarchy',
  templateUrl: './edit-hierarchy.component.html',
  styleUrls: ['./edit-hierarchy.component.css']
})
export class EditHierarchyComponent implements OnInit {
  @ViewChild('input') private checkInput;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  private ngUnsubscribe: Subject<any> = new Subject();
  data: any=[];
  dept: any;
  hierarchyData: any;
  editHierarchyForm : FormGroup;
  loading: boolean;
  parentId: any;
  devList: Array<DevicesInfo>;
  devicesListss: Array<DevicesInfo>;
  newArray: Array<any> = [];
  deviceName: Array<any> = [];
  students: any;
  devName: Array<any> = [];
  isDevice: boolean = false;
  selected:any;

  constructor(public dialogRef: MatDialogRef<EditHierarchyComponent>,
    private beatService: BeatServiceService,
    private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public hierarchydata: getHierarchyData ,
    public dialog: MatDialog, private getDevice: GetDeviceService) { 
      
    }

  ngOnInit() {
    this.parentId = JSON.parse(localStorage.getItem('ParentId')),
    this.data = this.hierarchydata;
    this.students =  this.data[0].studentsNo.split(',')
    for (var i =0; i < this.students.length; i++) {
      this.selected = this.students[i];
    }
    

    this.editHierarchyForm = this.fb.group({
      deptName: new FormControl(this.data[0].deptName, Validators.required),
      emailId: new FormControl(this.data[0].emailId, Validators.required),
      deptId: new FormControl(this.data[0].deptId, Validators.required),
      mobileNo: new FormControl(this.data[0].mobileNo, Validators.required),
      deptParentId: new FormControl(this.data[0].deptParentId, Validators.required),
      // studentsNo:  this.fb.array([]),
      studentsNo: new FormControl(this.students, Validators.required),

    });
    this.getDevices(this.parentId)
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.editHierarchyForm.controls[controlName].hasError(errorName);
  }

  inputChecked(data: any) {
    var name = data.name;
    var devName = name.slice(-3);
    let checked = false;
    for (var i = 0; i < this.students.length; i++) {
      this.selected= this.students[i];
      if (this.selected == devName) {
        checked = true;
      }
    }
    return checked;
    // this.changeDeviceByCategory(event, data)
  }


  GetRailwayDeptHierarchy(parentId) {
    this.loading = true;
    this.beatService.GetRailwayDepHierarchy(parentId).subscribe((res: Array<getHierarchyData>) => {
      this.loading = false;
      if(res.length == 0){
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
        this.hierarchyData = res;
        this.getDeptName();
        // console.log("this.hierarchyData",this.hierarchyData)
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
  getDeptName() {
    this.loading = true;
    this.beatService.GetDepartment()
    .takeUntil(this.ngUnsubscribe)
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
      }
    })
  }


  

 
  getDevices(pId) {
    this.devList = []
    this.loading = true;
    this.getDevice.getAllDeviceList(pId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: Array<DevicesInfo>) => {
      //  console.log("data", data)
        if(data.length <= 0){
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'NoStudentList'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          this.loading = false;
        }
        else{
          localStorage.setItem('devicesListss',JSON.stringify(data))
          this.devicesListss = JSON.parse(localStorage.getItem('devicesListss'))
          this.devList = this.devicesListss; 
          this.GetRailwayDeptHierarchy(this.parentId);
          // console.log(this.devList)

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
   
    // changeDeviceByCategory(event, devices) {
    //   var checked : boolean;
    //   var name = devices.name;
    //   // var devName = name.slice(-3);
    //   // console.log("event called",  devName.isChecked == true)
    //   // if (this.selected == event.target.checked ) {
    //   //   checked = true;
    //   // }
      
    //   // if (this.isDevice) {
    //   //   event.target.checked = true
    //   // }
     
    //   const formArray: FormArray = this.editHierarchyForm.get('studentsNo') as FormArray;
    //   if(event.target.checked){
    //     // Add a new control in the arrayForm
    //     formArray.push(new FormControl(event.target.value));
    //   }
     
    //   /* unselected */
    //   else{
    //     // find the unselected element
    //     let i: number = 0;
    //     formArray.controls.forEach((ctrl: FormControl) => {
    //       if(ctrl.value == event.target.value && ctrl.value == this.selected ) {
    //         // Remove the unselected element from the arrayForm
    //         formArray.removeAt(i);      
    //         return;
    //       }
    //       i++;
    //     });
    //   }
    // }

    updateHierarchyForm() {
    let studentsNumber = {
      studentsList : this.editHierarchyForm.get('studentsNo').value.toString()
    }
    if(this.editHierarchyForm.invalid) {
      return
    } else {
      this.loading = true;
      this.beatService.updateHierarchy(Object.assign(studentsNumber, this.editHierarchyForm.value))
      .subscribe((data: Message)=>{
        // console.log("data", data)
        if(data.error == "true"){
          this.loading = false;
          this.dialogRef.close();
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'HierarchyNotUpdated'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        } else {
          this.loading = false;
          this.dialogRef.close()
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'HierarchyUpdated'
          };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        // console.log("data approved", data)

      }
    })
    }
  }

    onNoClick() {
      this.dialogRef.close()
    }

    reset() {
      this.editHierarchyForm.reset();
    }
}
