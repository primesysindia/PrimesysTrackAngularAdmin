import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReportComponent } from '../report.component';

@Component({
  selector: '[app-off-device]',
  templateUrl: './off-device.component.html',
  styleUrls: ['./off-device.component.css']
})
export class OffDeviceComponent implements OnInit {

  @Input() offStatusData: any;
  offDevRepo: boolean;
  panelOpenState: boolean = true;
  
  constructor(private repo: ReportComponent) {
              if(this.repo.selReportType == 'Device Current Status' || this.repo.selReportType == 'Today'+"'"+'s Device Status'
                || this.repo.selReportType == 'Device ON OFF Status'){
                  this.offDevRepo = false
              } 
              else{
                this.offDevRepo = true;
              }
  }

  ngOnInit() {
  }

}
