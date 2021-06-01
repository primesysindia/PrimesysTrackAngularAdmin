import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output ,AfterViewInit,  OnDestroy } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BeatServiceService } from '../../services/beat-service.service';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { getAppModuleData } from '../../core/post';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { AddUserappModuleComponent } from '../add-userapp-module/add-userapp-module.component';
import { EditAppModuleComponent } from '../edit-app-module/edit-app-module.component';
import { DeleteAppModuleComponent } from '../delete-app-module/delete-app-module.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-app-module',
  templateUrl: './app-module.component.html',
  styleUrls: ['./app-module.component.css']
})
export class AppModuleComponent implements OnInit {
loading: boolean;
tableHeader: Array<string> = ['sr.No','module', 'moduleTitle','moduleDesc','moduleActivity','action','delete'];
private ngUnsubscribe: Subject<any> = new Subject();
public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
dataSource :any = [];
data: MatTableDataSource<getAppModuleData>;
@ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private beatService: BeatServiceService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getModuleList();
  }
  getModuleList() {
    this.loading = true;
    this.beatService.getAppModuleList()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((res: Array<getAppModuleData>)=> {
      console.log("data", res)
      this.loading = false;
      this.dataSource = res;
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'moduleNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.data = new MatTableDataSource<getAppModuleData>(res);
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
     let dialogRef = this.dialog.open(AddUserappModuleComponent, dialogConfig)
     .afterClosed().subscribe((result) => {
      this.getModuleList();
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

      let dialogRef = this.dialog.open(EditAppModuleComponent, dialogConfig)
      .afterClosed().subscribe((result) => {
        this.getModuleList();
      })
  // })
  }

  delete(data) {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        data: data
    };
      let dialogRef = this.dialog.open(DeleteAppModuleComponent, dialogConfig)
     .afterClosed().subscribe(dialogResult => {
        this.getModuleList();
     });
    
  }
}
