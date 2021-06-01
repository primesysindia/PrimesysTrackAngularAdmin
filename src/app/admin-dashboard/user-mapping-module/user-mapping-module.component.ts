import { Component, OnInit, ElementRef,EventEmitter,Output } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserDataService } from '../../services/user-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { BeatServiceService } from '../../services/beat-service.service';
import { getAppModuleData, getModuleforWeb } from '../../core/post';
import { Message } from 'src/app/core/message.model';

@Component({
  selector: 'app-user-mapping-module',
  templateUrl: './user-mapping-module.component.html',
  styleUrls: ['./user-mapping-module.component.css']
})
export class UserMappingModuleComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading: boolean= true;
  allParent: any;
  userMappingForm: FormGroup;
  moduleData: any;
  module: any;
  selected: any = [];
  
  newArray: Array<any> = [];
  constructor(private dataService: UserDataService,private beatService: BeatServiceService,
     public dialog: MatDialog, private fb: FormBuilder) { }

  ngOnInit() {
    this.userMappingForm = this.fb.group({
      'parentId': ['', Validators.required],
      'modulesName': ['']
    })
    this.getParentData();
  }

  getParentData() {
    this.selected = [];
    this.loading = true;
    this.dataService.getAllParentId()
    .takeUntil(this.ngUnsubscribe)
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
        this.allParent = data;
        // console.log(this.allParent);
        // this.dataService.ParentData = data;
       
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

  getSelectedParent(event) {
    this.selected = [];
    this.getModuleList(event.parentId);
  }

  getModuleList(pId) {
    this.selected = [];
    this.loading = true;
    this.beatService.getAppModuleListInUserMapping(pId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((res: Array<getAppModuleData>)=> {
      // console.log("data", res)
      this.loading = false;
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'moduleNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.moduleData = res;
        this.getCheckedModuleforWeb(pId)
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

  getCheckedModuleforWeb(pId) {
    this.selected = [];
    this.loading = true;
    this.beatService.GetModuleListForWeb(pId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((res: Array<getModuleforWeb>)=> {
      // console.log("data", res)
      this.loading = false;
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'moduleNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.module = res;
        for (var i = 0; i < this.moduleData.length; i++) {
          var ismatch = false; // we haven't found it yet
          for (var j = 0; j < this.module.length; j++) {
    
            if (this.moduleData[i].moduleId == this.module[j].ModuleId) {
              ismatch = true;
              this.moduleData[i].checked = true;//  checkbox status true
              
             this.selected.push(this.module[j].ModuleId)
              this.newArray.push(this.moduleData[i]);
              break;
            }
          }
          if (!ismatch) {
            this.moduleData[i].checked = false;//  checkbox status false
            this.newArray.push(this.moduleData[i]);
          } //End if
        }
        // console.log("newarray",this.newArray);
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

  onCheckChange(event, item){
    // console.log("initial", this.selected);

    if(event.checked){
      // console.log("item", event.source.value)
      this.selected.push(item.moduleId);
      // console.log("dee", this.selected);
    } else {

      const index: number = this.selected.indexOf(item.moduleId);
      // console.log(index)
      if (index !== -1) {
          this.selected.splice(index, 1);
      }
      // console.log("deedfkdshf", this.selected);
    }
  }
  save(data) {
     let newArray = {
      str_array : this.selected.join('~')
     }  
    this.loading = true; 
    this.beatService.SaveUserMappingModule(Object.assign(newArray, this.userMappingForm.value))
        .subscribe((data: Message)=>{
          // console.log(data)
          if(data.error == "true"){
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'ModuleNotMapping'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
           else {
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'ModuleMapped'
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
          // console.log("data", data)
        })
  }
}
