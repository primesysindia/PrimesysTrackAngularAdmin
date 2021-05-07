import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output ,AfterViewInit,  OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { BeatServiceService } from '../../services/beat-service.service';
import {  Subject } from 'rxjs';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { UserDataService } from '../../services/user-data.service';
import { ParentUserList} from '../../core/post';
import { FormControl} from '@angular/forms';
import { EditKeymenBeatsComponent } from '../edit-keymen-beats/edit-keymen-beats.component';
import { PatrolmenBeatApprovalComponent } from '../patrolmen-beat-approval/patrolmen-beat-approval.component';

@Component({
  selector: 'app-patrolmen-beat-verification',
  templateUrl: './patrolmen-beat-verification.component.html',
  styleUrls: ['./patrolmen-beat-verification.component.css']
})
export class PatrolmenBeatVerificationComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  tableHeader: Array<string> = ['Devicename','DeviceId', 'KmStart', 'KmEnd', 'SectionName', 'status', 'edit'];
  dataSource :any = [];
  loading: any;
   parentUser: any;
  parentList: ParentUserList[];
  filteredList: any;parentlist = new FormControl();
  allPosts: any;
  autoCompleteList: any[];
  parentId: any;

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  
  constructor(
    private beatService: BeatServiceService,
    public dialog: MatDialog,
    private dataService: UserDataService) { }

  ngOnInit() {
    this.getParentData();
  }

  getParentData() {
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
        this.allPosts = data;
        this.dataService.ParentData = data;
        // console.log("this.parentUser", this.allPosts)
        // this.getDevices(this.pId)

        this.parentlist.valueChanges.subscribe(userInput => {
          this.autoCompleteExpenseList(userInput);
        })
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

  private autoCompleteExpenseList(input) {
    let categoryList = this.filterCategoryList(input)
    this.autoCompleteList = categoryList;
  }

  filterCategoryList(val) {
    var categoryList = []
    if (typeof val != "string") {
      return [];
    }
    if (val === '' || val === null) {
      return [];
    }
    return val 
    ? this.allPosts.filter(element => element.Name && element.Name.toLowerCase().indexOf(val.toString().toLowerCase()) != -1) 
    : this.allPosts;  
   
  }

  displayFn(post: ParentUserList) {
    let k = post ? post.Name : post;
    return k;
  }

  filterPostList(event) {
    var posts= event.source.value;
        if(!posts) {
          this.dataService.searchOption=[]
        }
        else {
            this.dataService.searchOption.push(posts);
            this.onSelectedOption.emit(this.dataService.searchOption)
        }
       
        this.focusOnPlaceInput();
  }

  removeOption(option) {
    let index = this.dataService.searchOption.indexOf(option);
    if (index >= 0)
        this.dataService.searchOption.splice(index, 1);
        this.focusOnPlaceInput();
        this.onSelectedOption.emit(this.dataService.searchOption)
  }

  focusOnPlaceInput() {
    this.autocompleteInput.nativeElement.focus();
    this.autocompleteInput.nativeElement.value = '';
  }

  optionClicked(event: Event, user: ParentUserList) {
    this.getExistingBeats( user.parentId);
    this.parentId = user.parentId;
  }

  getExistingBeats(parentId) {
    this.loading = true;
    this.beatService.getPatrolmenExistingBeatByParent(parentId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data: any) => {
      console.log("data", data)
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
        this.dataSource = data;
      } 
      this.loading = false;
    })
  }

  approveDialog(rowData) {
    const message = 'Do you want to approve this?';
    const dialogConfig = new MatDialogConfig();

      dialogConfig.data = rowData;
      dialogConfig.maxWidth= "400px";

      let dialogRef = this.dialog.open(PatrolmenBeatApprovalComponent, dialogConfig)
  
     .afterClosed().subscribe(dialogResult => {
        this.getExistingBeats(this.parentId);
      });
    
  }
}
