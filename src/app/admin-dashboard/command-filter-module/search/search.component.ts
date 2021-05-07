import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { BeatServiceService } from '../../../services/beat-service.service';
import { UserDataService } from '../../../services/user-data.service';
import { ParentUserList} from '../../../core/post';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../../../dialog/history-not-found/history-not-found.component';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogConfig} from '@angular/material';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  form: FormGroup; 
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
  pId: any;
  @Output() groupFilters: EventEmitter<any> = new EventEmitter<any>();
  searchText: string = '';
  constructor(private fb: FormBuilder,private dataService: UserDataService,  public dialog: MatDialog) {}
  ngOnInit(): void {
    this.getParentData();
    this.buildForm();
  }
  
  buildForm(): void {
  this.form = this.fb.group({
    ParentId: new FormControl(''),
    deviceId: new FormControl(''),
    commandDeliveredMsg: new FormControl(''),
    command: new FormControl(''),
    login_name: new FormControl(''),
  // agefrom: new FormControl(''),
  // ageto: new FormControl('')
  });
  }

 search(filters: any): void {
  Object.keys(filters).forEach(key => filters[key] === '' ? delete filters[key] : key);
  this.groupFilters.emit(filters);
// console.log(this.groupFilters)
}

Reset() {
  this.form.reset();
  this.groupFilters.emit();
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

optionClicked(event: Event, user: ParentUserList) {
console.log(user);
  // this.getDevices(user.parentId);
  this.pId = user.parentId;
  this.form.patchValue({    
    "ParentId": this.pId 
    });   
}
}
