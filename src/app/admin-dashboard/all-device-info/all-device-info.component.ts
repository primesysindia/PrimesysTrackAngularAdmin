import { Component, OnInit, ViewChild } from '@angular/core';
import { BeatServiceService } from '../../services/beat-service.service';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { GetAllDeviceInfo} from '../../core/post';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { EditDeviceDetailsComponent } from '../edit-device-details/edit-device-details.component';
import { ExcelServiceService } from '../../services/excel-service.service';
import { AddDeviceComponent } from '../add-device/add-device.component';

@Component({
  selector: 'app-all-device-info',
  templateUrl: './all-device-info.component.html',
  styleUrls: ['./all-device-info.component.css']
})
export class AllDeviceInfoComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading: boolean = true;
  tableHeader: Array<string> = ['parentId', 'studentId', 'userName', 'deviceName', 'deviceId', 'deviceSimNo', 'activationDate', 'Action'];
  dataSource :any = [];
  devInfo: MatTableDataSource<GetAllDeviceInfo>;
  data: any;
  divisionSearch: any = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private beatService: BeatServiceService,
    public dialog: MatDialog,
    // private userSearch: UserSearchPipe,
    private excelServ: ExcelServiceService) { }

  ngOnInit() {
    this.loading = true;
    this.beatService.getAllDevicesInfo().subscribe((res: Array<GetAllDeviceInfo>) => {
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'NoParentList'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.loading = false;
        this.data = res;
        this.devInfo = new MatTableDataSource<GetAllDeviceInfo>(this.data);
        this.dataSource = this.devInfo;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }       
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

  downloadFile(){
        this.excelServ.generateAllDeviceInfo(this.data,this.tableHeader)
  }
  
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    // console.log(this.dataSource.filter)
  }

  // filterbyUserName(filterValue: string){
  //   return items.filter(value => { 
  //     return (value.Name.toLowerCase().includes(searchText) || value.Name.includes(searchText)) == true
  //   })
  //   // this.patrolmanSummaryReport = this.userFilter.transform(this.dataSource,mrChange.value);
  //   // console.log(this.patrolmanSummaryReport)
  // }

  openEditDialog(data): void {
    const dialogConfig = new MatDialogConfig();
    this.beatService.getAllDevicesInfo().subscribe((res)=> {
      dialogConfig.width = '600px';
      // dialogConfig.data = res;
      dialogConfig.data = {
        width: '600px',
        pId: data,
        response: res
      };
      // console.log("id",dialogConfig.data)

      let dialogRef = this.dialog.open(EditDeviceDetailsComponent, dialogConfig)
      .afterClosed().subscribe((result) => {
      })
  })
  }

  // addDeviceDialog() {
  //   const dialogConfig = new MatDialogConfig();
  //   let dialogRef = this.dialog.open(AddDeviceComponent, dialogConfig)
  //    .afterClosed().subscribe(dialogResult => {
  //     });
  // }
  
}
