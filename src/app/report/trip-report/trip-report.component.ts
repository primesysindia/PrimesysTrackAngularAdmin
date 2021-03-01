import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReportComponent } from '../report.component';

@Component({
  selector: '[app-trip-report]',
  templateUrl: './trip-report.component.html',
  styleUrls: ['./trip-report.component.css']
})
export class TripReportComponent implements OnInit {

  @Input() trpRepoData: any;
  @Input() index: number;
  @Output() totalDist: EventEmitter<number> = new EventEmitter();
  @Output() stopMins = new EventEmitter();
  previousEndTime: number;
  nextStartTime: number;
  stoppageMins: number;
  tripRepo: boolean;
  monitorRepo: boolean;
  batteryStatRepo: boolean;
  dateRangeExceptionRepo: boolean;
 
  constructor(private rep: ReportComponent) {}

  ngOnInit() {
    if(this.rep.selReportType == 'Trip Report' || this.rep.selReportType == 'Monthly Report'){
      this.tripRepo = true;
      this.monitorRepo = false;
      this.batteryStatRepo = false;
      this.dateRangeExceptionRepo =false;
    }
    else if(this.rep.selReportType == 'Monitor SOS Press'){
      this.tripRepo = false;
      this.monitorRepo = true;
      this.batteryStatRepo = false;
      this.dateRangeExceptionRepo =false;
    }
    else if(this.rep.selReportType == 'Device Battery Status'){
      this.tripRepo = false;
      this.monitorRepo = false;
      this.batteryStatRepo = true;
      this.dateRangeExceptionRepo =false;
    }
    else if(this.rep.selectedReportType == "DateRangeExceptionReport"){
      this.tripRepo = false;
      this.monitorRepo = false;
      this.batteryStatRepo = false;
      this.dateRangeExceptionRepo =true;
    }
    if(this.rep.selReportType == 'Trip Report' || this.rep.selReportType == 'Monthly Report'){
      if(this.index == 0){
        this.rep.totalDistance = +this.trpRepoData.totalkm;
      }
      else{
        this.rep.totalDistance = this.rep.totalDistance + (+this.trpRepoData.totalkm)
      }
      if(this.index == this.rep.tripRepo.length-1){
        this.totalDist.emit(this.rep.totalDistance)
      }
    }
  }

  getStoppageMins(){
    if(this.index == 0){
      this.stoppageMins = 0;
      this.stopMins.emit(this.stoppageMins)
    }
    else{
      this.previousEndTime= +this.rep.tripRepo[this.index-1].desttimestamp
      this.nextStartTime = +this.trpRepoData.srctimestamp
      this.stoppageMins = (this.nextStartTime-this.previousEndTime)/(60)
      this.stopMins.emit(this.stoppageMins)
    }
    return this.stoppageMins;
  }

}
