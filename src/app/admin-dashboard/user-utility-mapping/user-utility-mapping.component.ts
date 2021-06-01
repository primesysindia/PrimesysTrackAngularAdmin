import { Component, OnInit, ElementRef,EventEmitter,Output } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserDataService } from '../../services/user-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { BeatServiceService } from '../../services/beat-service.service';
import { getUtilityForWeb, getUtilityData } from '../../core/post';
import { Message } from 'src/app/core/message.model';

@Component({
  selector: 'app-user-utility-mapping',
  templateUrl: './user-utility-mapping.component.html',
  styleUrls: ['./user-utility-mapping.component.css']
})
export class UserUtilityMappingComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading: boolean= true;
  allParent: any;
  userUtilityForm: FormGroup;
  utilityData: any;
  utility: any;
  selected: any = [];
  
  newArray: Array<any> = [];
  constructor(private dataService: UserDataService,private beatService: BeatServiceService,
     public dialog: MatDialog, private fb: FormBuilder) { }

  ngOnInit() {
    this.userUtilityForm = this.fb.group({
      'parentId': ['', Validators.required],
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
    this.getUtilityList(event.parentId);
  }

  getUtilityList(pId) {
    this.loading = true;
    this.beatService.getUtilityListInUserMapping(pId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((res: Array<getUtilityData>)=> {
      console.log("data", res)
      this.loading = false;
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'utilityNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.utilityData = res;
        this.getCheckedUtilityforWeb(pId)
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

  getCheckedUtilityforWeb(pId) {
    this.selected = [];
    this.loading = true;
    this.beatService.GetUtilityListForWeb(pId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((res: Array<getUtilityForWeb>)=> {
      // console.log("data", res)
      this.loading = false;
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'utilityNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.utility = res;
        for (var i = 0; i < this.utilityData.length; i++) {
          var ismatch = false; // we haven't found it yet
          for (var j = 0; j < this.utility.length; j++) {
    
            if (this.utilityData[i].utilityId == this.utility[j].utilityId) {
              ismatch = true;
              this.utilityData[i].checked = true;//  checkbox status true
              
             this.selected.push(this.utility[j].utilityId)
              this.newArray.push(this.utilityData[i]);
              break;
            }
          }
          if (!ismatch) {
            this.utilityData[i].checked = false;//  checkbox status false
            this.newArray.push(this.utilityData[i]);
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
      this.selected.push(item.utilityId);
      // console.log("dee", this.selected);
    } else {

      const index: number = this.selected.indexOf(item.utilityId);
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
    this.beatService.SaveUserUtilityModule(Object.assign(newArray, this.userUtilityForm.value))
        .subscribe((data: Message)=>{
          console.log(data)
          if(data.error == "true"){
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'UtilityNotMapping'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
           else {
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'UtilityMapped'
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
          // console.log("data", data)
        })
  }
}
