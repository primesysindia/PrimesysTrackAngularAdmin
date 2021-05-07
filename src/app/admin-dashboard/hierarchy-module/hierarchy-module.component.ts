import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output, ChangeDetectorRef } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { GetDeviceService } from '../../services/get-device.service';
import { BeatServiceService } from '../../services/beat-service.service';
import { DevicesInfo } from '../../core/devicesInfo.model';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogConfig, MatTableDataSource} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { ParentUserList, getHierarchyData} from '../../core/post';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { onMainContentChange } from '../../core/animation';
import { SidenavService } from '../../services/sidenav.service';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { AddHierarchyComponent } from '../add-hierarchy/add-hierarchy.component';
import { EditHierarchyComponent } from '../edit-hierarchy/edit-hierarchy.component';
import { ApproveHierarchyComponent } from '../approve-hierarchy/approve-hierarchy.component';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-hierarchy-module',
  templateUrl: './hierarchy-module.component.html',
  styleUrls: ['./hierarchy-module.component.css'],
  animations: [onMainContentChange,
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HierarchyModuleComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  parentUser: any;
  parentList: ParentUserList[];
  filteredList: any;
  showSTudentList: boolean = false;
  loading: boolean= true;
  devList: Array<DevicesInfo>;
  devicesListss: Array<DevicesInfo>;
  showAddButton: boolean= false;
  isDevice: boolean = false;
  allPosts: any;
  parentlist = new FormControl();
  autoCompleteList: any[];
  hierarchyForm : FormGroup;
  tableHeader: Array<string> = ['deptName', 'userPassword', 'emailId', 'mobileNo', 'designation','action', 'status'];
  hierarchyData: MatTableDataSource<getHierarchyData>;
  expandedElement: any;
  dataSource: any=[];
  parentId: any;
  showApprove: boolean;
  approved: boolean;
  result: boolean;

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public onSideNavChange: boolean;

  constructor(private dataService: UserDataService, 
    private getDevice: GetDeviceService, public fb: FormBuilder,
    private beatService: BeatServiceService, private _sidenavService: SidenavService,
    public dialog: MatDialog) { 
      this._sidenavService.sideNavState$.subscribe( res => {
        console.log(res)
        this.onSideNavChange = res;
      })
    }

  ngOnInit() {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var roleId = userInfo.roleId;
    if(roleId == 4 || roleId == 20) {
      this.showApprove = true;
      this.approved = false;
    } else {
      this.showApprove = false;
      this.approved = true;

    }
    this.getParentData()
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
    this.devList = []
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
    this.showAddButton = false;
    this.dataSource = [];
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
    localStorage.setItem('ParentId', JSON.stringify(user.parentId));
    this.parentId = JSON.parse(localStorage.getItem('ParentId'));
    this.showAddButton = true;
    this.GetRailwayDeptHierarchy(this.parentId)
  }

  GetRailwayDeptHierarchy(parentId) {
    this.loading = true;
    this.beatService.GetRailwayDepHierarchy(parentId).subscribe((res: Array<getHierarchyData>)=> {
      this.loading = false;
      console.log(res)
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'depHieNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.hierarchyData = new MatTableDataSource<getHierarchyData>(res);
        this.dataSource = this.hierarchyData;
        // console.log("datasorce", this.dataSource)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
  
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.hierarchyData.filter = filterValue;
  }

  //Open dialog for add-hierarchy form
  openDialog(): void {
    var pId = JSON.parse(localStorage.getItem('ParentId'))
    let dialogRef = this.dialog.open(AddHierarchyComponent, {
      width: '700px',
      // height:'500px'
    }).afterClosed().subscribe((result) => {
      this.GetRailwayDeptHierarchy(this.parentId)
    })
  }

  openEditDialog(hId): void {
    // console.log("hId", hId)
    var pId = JSON.parse(localStorage.getItem('ParentId'))
    localStorage.setItem('hierachyId',JSON.stringify(hId))
    const dialogConfig = new MatDialogConfig();

   this.beatService.GetRailwayDepHierarchyById(pId, hId).subscribe((res: Array<getHierarchyData>)=> {
      dialogConfig.width = '600px';
      dialogConfig.data = res;
      // console.log("id",dialogConfig.data)

      let dialogRef = this.dialog.open(EditHierarchyComponent, dialogConfig)
      .afterClosed().subscribe((result) => {
        this.GetRailwayDeptHierarchy(pId)
      })
  })
  }

  confirmDialog(hierarchyId) {
    const dialogConfig = new MatDialogConfig();
    var pId = JSON.parse(localStorage.getItem('ParentId'))
    var stdId = JSON.parse(localStorage.getItem('StudentID'))
    this.beatService.GetRailwayDepHierarchyById(pId, hierarchyId).subscribe((res: Array<getHierarchyData>)=> {
      // dialogConfig.width = '600px';
      dialogConfig.data = res;
      dialogConfig.maxWidth= "400px";

      let dialogRef = this.dialog.open(ApproveHierarchyComponent, dialogConfig)
  
     .afterClosed().subscribe(dialogResult => {
        this.result = dialogResult;
        this.GetRailwayDeptHierarchy(pId)
      });
  })
    
  }

}
