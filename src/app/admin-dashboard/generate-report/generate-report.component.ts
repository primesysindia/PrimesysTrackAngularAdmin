import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output, AfterViewInit,  OnDestroy  } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserDataService } from '../../services/user-data.service';
import { ParentUserList} from '../../core/post';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { onMainContentChange } from '../../core/animation';
import { SidenavService } from '../../services/sidenav.service';
import { BeatServiceService } from '../../services/beat-service.service';
import { Message } from 'src/app/core/message.model';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { MatDialog, MatDialogConfig, MatTableDataSource} from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.css']
})
export class GenerateReportComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  post: any;
  loading: boolean;
  parentId: any;
  parentData: any;
  parentList:Array<ParentUserList>;
  data: any;
  parentsLists: any;
  parentDataList: any;
  allPosts: any;
  parentlist = new FormControl();
  autoCompleteList: any[];
  reportForm: FormGroup;

  constructor(private dataService: UserDataService, 
    public dialog: MatDialog,
    private beatService: BeatServiceService,
    public fb: FormBuilder) { }

  ngOnInit() {  
    this.reportForm = this.fb.group({
    'parentlist1': [''],
    'reportType': ['', Validators.required]
  });
    this.getParentData();
  }
  getParentData() {
    this.loading = true;
    this.dataService.getAllParentId()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data: any) => {
      if(data.length == 0){
        // this.loading = false;
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
      return this.allPosts;
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

  // optionClicked(event: Event, user: ParentUserList) {
  //   this.getDevices(user.parentId);
  // }
}
