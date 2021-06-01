import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output ,AfterViewInit,  OnDestroy } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BeatServiceService } from '../../services/beat-service.service';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { getUtilityData } from '../../core/post';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { MatPaginator } from '@angular/material/paginator';
import { AddUserUtilityComponent } from '../add-user-utility/add-user-utility.component';
import { EditUserUtilityComponent } from '../edit-user-utility/edit-user-utility.component';
import { DeleteUserUtilityComponent } from '../delete-user-utility/delete-user-utility.component';

@Component({
  selector: 'app-user-utility-module',
  templateUrl: './user-utility-module.component.html',
  styleUrls: ['./user-utility-module.component.css']
})
export class UserUtilityModuleComponent implements OnInit {
  loading: boolean;
  tableHeader: Array<string> = ['sr.No','utility', 'utilityTitle','utilityDesc','utilityActivity','action','delete'];
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  dataSource :any = [];
  data: MatTableDataSource<getUtilityData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
    constructor(private beatService: BeatServiceService,
      public dialog: MatDialog) { }

  ngOnInit() {
    this.getUtilityList();
  }
  getUtilityList() {
    this.loading = true;
    this.beatService.getUserUtiltyList()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((res: Array<getUtilityData>)=> {
      // console.log("data", res)
      this.loading = false;
      this.dataSource = res;
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'utilityNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.data = new MatTableDataSource<getUtilityData>(res);
        this.dataSource = this.data;
        this.dataSource.paginator = this.paginator;
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

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    //pass data to dialog
    dialogConfig.data = {
        width: '600px',
       
    };
     let dialogRef = this.dialog.open(AddUserUtilityComponent, dialogConfig)
     .afterClosed().subscribe((result) => {
      this.getUtilityList();
    })
  }

  // Open edit-form dialog
  openEditDialog(data): void {
    console.log(data)
    const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '600px';
      // dialogConfig.data = res;
      dialogConfig.data = {
        response: data
      };

      let dialogRef = this.dialog.open(EditUserUtilityComponent, dialogConfig)
      .afterClosed().subscribe((result) => {
        this.getUtilityList();
      })
  // })
  }

  delete(data) {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        data: data
    };
      let dialogRef = this.dialog.open(DeleteUserUtilityComponent, dialogConfig)
     .afterClosed().subscribe(dialogResult => {
        this.getUtilityList();
     });
    
  }
}
