import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { ParentUserList } from '../../core/post';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { onMainContentChange } from '../../core/animation';
import { SidenavService } from '../../services/sidenav.service';
import { BeatServiceService } from '../../services/beat-service.service';
import { Message } from 'src/app/core/message.model';
import { GetDeviceService } from '../../services/get-device.service';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { ConfirmDeviceexcahngeComponent } from '../confirm-deviceexcahnge/confirm-deviceexcahnge.component';
import { NewStudentUpdateComponent } from '../new-student-update/new-student-update.component';

@Component({
  selector: 'app-student-update',
  templateUrl: './student-update.component.html',
  styleUrls: ['./student-update.component.css'],
  animations: [ onMainContentChange ]
})
export class StudentUpdateComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; 
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  public onSideNavChange: boolean;

  studentExchangeForm: FormGroup;
  studentForm: FormGroup;
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
  currUser: any;
  result: any;
  showButton: boolean = false;

  constructor(private dataService: UserDataService, 
    public dialog: MatDialog,
    private getDevice: GetDeviceService, 
    private _sidenavService: SidenavService,
    private beatService: BeatServiceService,
    public fb: FormBuilder, ) { 
      this._sidenavService.sideNavState$.subscribe( res => {
      this.onSideNavChange = res;
    }) 
  }

  ngOnInit() {
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'))
    this.studentForm = this.fb.group({
      'parentlist': [''],
      'name': ['', Validators.required],
      'id': ['', Validators.required ]   
    })
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

  optionClicked(event: Event, user: ParentUserList) {
    this.showButton = true;
    localStorage.setItem('ParentId', JSON.stringify(user.parentId));
  }

  submit() {
    var name = this.studentForm.get('name').value;
    var std_id = this.studentForm.get('id').value;
    var sid = std_id.match(/,/g).length;
    var sname = name.match(/,/g).length;

    if(sid == sname) {
      // console.log("second loop")
      this.loading = true;
      this.beatService.updateStudentName(this.studentForm.value)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          // console.log("data", data)
          if(data.error == "true"){
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'StudentNotAdded'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          } else {
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'StudentAdded'
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          // window.location.reload();
          this.studentForm.reset();
          }
        })
    }
    else {
      // return
      const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'errors'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
    }
  }

  reset() {
    this.studentExchangeForm.reset()
  }

  ngOnDestroy(): void{
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  }


