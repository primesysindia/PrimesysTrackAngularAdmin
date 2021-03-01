import { Component, OnInit, Input } from '@angular/core';
import { ReportComponent } from '../report.component';

@Component({
  selector: '[app-current-status]',
  templateUrl: './current-status.component.html',
  styleUrls: ['./current-status.component.css']
})
export class CurrentStatusComponent implements OnInit {

  @Input() onStatusData: any;
  showLocation: boolean = false;
  panelOpenState: boolean = true;
  currentTime = Date.now();
  offHrs: string = '';

  constructor(private repo: ReportComponent) {
                if(this.repo.selReportType == 'Device Current Status' || this.repo.selReportType == 'Today'+"'"+'s Device Status'
                  || this.repo.selReportType == 'Device ON OFF Status'){
                  this.showLocation = true;
                }
                else{
                  this.showLocation = false;
                }
          }

  ngOnInit() {
    if(this.repo.selReportType == 'Today'+"'"+'s Device Status'){
      let timeDiff= this.currentTime - this.onStatusData.time*1000;
      if(timeDiff > 3600000){
        this.offHrs = 'Last reported: '+(timeDiff/1000/60/60).toFixed(1)+' Hrs ago'
      }
      else{
        this.offHrs = ''
      }
    }
  }

}
