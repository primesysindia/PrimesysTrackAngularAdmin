import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { GetExchangedDeviceList } from '../../core/post';
import { BeatServiceService } from '../../services/beat-service.service';
import { Subject } from 'rxjs';
import { Message } from 'src/app/core/message.model';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-exchange-history',
  templateUrl: './exchange-history.component.html',
  styleUrls: ['./exchange-history.component.css']
})
export class ExchangeHistoryComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  private ngUnsubscribe: Subject<any> = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  loading: boolean = false;
  tableHeader: Array<string> = ['beforeDeviceId1','beforeDeviceId2','afterDeviceId1','afterDeviceId2',
  'beforDeviceSimNo1','beforDeviceSimNo2', 'afterDeviceSimNo1','afterDeviceSimNo2'];
  dataSource :any = [];
  Data: MatTableDataSource<GetExchangedDeviceList>;
  parent_id: any;

  constructor(public dialogRef: MatDialogRef<ExchangeHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data,  
    public dialog: MatDialog,
    private beatService: BeatServiceService) { }

  ngOnInit() {
   this.getexchangeHistory();
  }

  getexchangeHistory() {
     this.loading = true;
     if(this.data.length == 0) {
      this.loading = false;
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.data = {
        hint: 'exchHistoryNotFound'
      };
      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)  
    }else {
      this.loading = false;
      this.Data = new MatTableDataSource<GetExchangedDeviceList>(this.data);
      this.dataSource = this.Data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  onNoClick() {
    this.dialogRef.close();
  }
  
}
