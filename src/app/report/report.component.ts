import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ModuleList } from '../core/moduleList.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DevicesInfo } from '../core/devicesInfo.model';
import { ReportService } from '../services/report.service';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { TripReportInfo } from '../core/tripReport.model';
import { ExcelService } from '../services/excel.service';
import { User } from '../core/user.model';
import { CurrentStatus } from '../core/currentStatus.model';
import { MonitorSos } from '../core/monitorSos.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material";
import { trigger, transition, style, animate } from '@angular/animations';
import * as _moment from 'moment';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

const moment = _moment;


export const ISO_FORMAT = {
  parse: {
      dateInput: 'LL',
  },
  display: {
      dateInput: 'DD-MMM-YY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  animations: [
    trigger('slideVerticle', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1, display: 'none' }),
        animate('500ms', style({ transform: 'translateY(-100%)', opacity: 0 })),
      ])
    ])
  ],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: ISO_FORMAT},
  ]
})
export class ReportComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  moduleList:Array<ModuleList>;
  deviceList: Array<DevicesInfo>;
  reportForm:FormGroup;
  currTime: Date;
  d:Date = new Date();
  minDate: Date = new Date(this.d.getFullYear(),this.d.getMonth()-3,this.d.getDate());
  maxDate: Date = new Date(this.d.getFullYear(),this.d.getMonth(),this.d.getDate()-1);
  setStartDt: Date = new Date(this.d.getFullYear(),this.d.getMonth()-1,this.d.getDate())
  selReportDate: Date;
  selStartDate: Date;
  selEndDate:Date;
  currentUser: User;
  monthlyReportShow: boolean = true;
  currDevReportShow: boolean = true;
  tripReportShow: boolean = true;
  deviceListShow: boolean = true;
  selectedImei_no: string;
  chkExpiry: number;
  selectedDeviceName: string;
  tripRepo: Array<TripReportInfo>;
  tableHeading: string[];
  showCaption: boolean = false;
  showTripCaption: boolean = false;
  showRepoCaption: boolean = false;
  showSideInfo: boolean = false;
  selectedReportType: string;
  selReportType:string;
  selDeviceName:string;
  totalDistance: number = 0;
  stoppageMins: Array<any> = [];
  deviceOnStatus: Array<any> = [];
  deviceOffStatus: Array<any> = [];
  offDeviceHeader: boolean = false;
  onDeviceHeader:boolean = false;
  offDevicesCount: number;
  onDevicesCount:number;
  currntStatRepoShow:boolean = false;
  currOffDevice: Array<any> = [];
  currOnDevice: Array<any> = [];
  monitorSos: Array<any> = [];
  distUnit: string;
  exceptionRepo: Array<any> = [];
  showExceptionRepo: boolean = false;
  exceptionRepoUrl: string = 'http://primesystech.com/PrimesysTrackReport/Phulera/ExceptionReport_Keyman/'
  reportDetails: string;
  reverse: boolean = false;
  showRepoCard: boolean = true;
  //to search device
  searchDevice: string = '';
  //Datewise Exception report
  showExceptionError: boolean = false;
  DateRangeException: Array<any> = [];
  showExceptionRepoType: boolean = false;
  selectedExceptionRepo: string = '';
  uniqueTimestamp: Array<any> = [];
  uniqueDevices: Array<string> = [];
  exceptionRepoList = ['Low Battery Exception', 'Beat Not Covered Exception', 'Off Device Exception', 'Overspeed Exception']
  //spinner
  public loading:boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  
  constructor(public dialog: MatDialog,
              private fb: FormBuilder,
              private reportServ: ReportService,
              private excelServ: ExcelService,
              private datePipe: DatePipe
              ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUserInfo'))
    this.moduleList =JSON.parse(localStorage.getItem('moduleList'))
    this.deviceList = JSON.parse(localStorage.getItem('devicesList'))
    //console.log(this.deviceList)
    this.reportForm = this.fb.group({
      reportType: ['', Validators.required],
      exceptionReportType: [''],
      selectedDevice: [''],
      startDate: new FormControl(moment().subtract(1, 'months').startOf('day')),
      endDate: new FormControl(moment().subtract(1, 'days').endOf('day')),
      timeInMins: [5],
      reportDate: new FormControl(moment().subtract(1, 'days').startOf('day'))
    })
  }

  get f() { return this.reportForm.controls; }

  reportRequirement(){
    //console.log(this.f.reportType.value);
    const selDev = this.reportForm.get('selectedDevice');
    const startDt = this.reportForm.get('startDate');
    const endDt = this.reportForm.get('endDate');
    const TimeMin = this.reportForm.get('timeInMins');
    const reportDt = this.reportForm.get('reportDate');
    const exceptionRepoType = this.reportForm.get('exceptionReportType')
    this.selectedReportType = this.f.reportType.value.Module;
    this.deviceListShow = true;
    this.monthlyReportShow = true;
    this.currDevReportShow = true;
    this.tripReportShow = true;
    this.reportDetails = "";
    this.showExceptionError = false;
    this.showExceptionRepoType = false;
    this.maxDate = new Date(this.d.getFullYear(),this.d.getMonth(),this.d.getDate()-1);
    this.reportForm.patchValue({startDate: (moment().subtract(1, 'months').startOf('day')) })
    this.reportForm.patchValue({reportDate: (moment().subtract(1, 'days').startOf('day')) })
    switch(this.f.reportType.value.Module){
      case 'CurrentDeviceStatus': {
        this.currDevReportShow = false;
        this.reportDetails = "Shows statuses of devices within the last 'x' minutes (selected minutes)"
        TimeMin.setValidators([Validators.required]);
        selDev.clearValidators();
        startDt.clearValidators();
        endDt.clearValidators();
        reportDt.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'DeviceOnReport': {
        this.tripReportShow = false;
        this.reportDetails = 'Shows list of ON devices with their first ON time for the selected date and list of OFF devices'
        reportDt.setValidators([Validators.required]);
        selDev.clearValidators();
        startDt.clearValidators();
        endDt.clearValidators();
        TimeMin.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'DeviceOffReport': {
        this.tripReportShow = false;
        this.reportDetails = 'Shows list of ON devices with their last OFF time for the selected date and list of OFF devices'
        reportDt.setValidators([Validators.required]);
        selDev.clearValidators();
        startDt.clearValidators();
        endDt.clearValidators();
        TimeMin.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'MonitorSOSPress': {
        this.tripReportShow = false;
        this.reportDetails = 'Shows list of devices that have pressed SOS button for the selected date'
        reportDt.setValidators([Validators.required]);
        selDev.clearValidators();
        startDt.clearValidators();
        endDt.clearValidators();
        TimeMin.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'DeviceONOffStatus': {
        this.tripReportShow = false;
        this.reportDetails = 'Shows list of OFF devices with time, and ON devices with last reported time on selected date'
        reportDt.setValidators([Validators.required]);
        selDev.clearValidators();
        startDt.clearValidators();
        endDt.clearValidators();
        TimeMin.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'DeviceBatteryStatus': {
        this.reportDetails = 'Shows list of devices with the last reported battery status and time'
        selDev.clearValidators();
        startDt.clearValidators();
        endDt.clearValidators();
        TimeMin.clearValidators();
        reportDt.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'TodayDeviceStatus': {
        this.reportDetails = 'Shows list of devices that are either OFF or have been ON at least one time today'
        selDev.clearValidators();
        startDt.clearValidators();
        endDt.clearValidators();
        TimeMin.clearValidators();
        reportDt.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'DailyMileageReport': {
        this.tripReportShow = false;
        this.reportDetails = ''
        reportDt.setValidators([Validators.required]);
        selDev.clearValidators();
        startDt.clearValidators();
        endDt.clearValidators();
        TimeMin.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'EmpAttendnce': {
        this.tripReportShow = false;
        this.reportDetails = ''
        reportDt.setValidators([Validators.required]);
        selDev.clearValidators();
        startDt.clearValidators();
        endDt.clearValidators();
        TimeMin.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'MonthlyMileageReport': {
        this.deviceListShow = false;
        this.monthlyReportShow = false;
        this.reportDetails = 'Shows trips covered for the selected device from the selected date range'
        selDev.setValidators([Validators.required]);
        startDt.setValidators([Validators.required]);
        endDt.setValidators([Validators.required]);
        TimeMin.clearValidators();
        reportDt.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'TripReport': {
        this.deviceListShow = false;
        this.tripReportShow = false;
        this.reportDetails = "Shows trips completed by the selected device for the selected date"
        selDev.setValidators([Validators.required]);
        reportDt.setValidators([Validators.required]);
        startDt.clearValidators();
        endDt.clearValidators();
        TimeMin.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'GeofenceHistory': {
        this.deviceListShow = false;
        this.tripReportShow = false;
        this.reportDetails = ""
        selDev.setValidators([Validators.required]);
        reportDt.setValidators([Validators.required]);
        startDt.clearValidators();
        endDt.clearValidators();
        TimeMin.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'NearByPoint&CrossingInspection': {
        this.tripReportShow = false;
        this.reportDetails = ""
        reportDt.setValidators([Validators.required]);
        selDev.clearValidators();
        startDt.clearValidators();
        endDt.clearValidators();
        TimeMin.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'NearByLevelCrossingInspection': {
        this.tripReportShow = false;
        this.reportDetails = ""
        reportDt.setValidators([Validators.required]);
        selDev.clearValidators();
        startDt.clearValidators();
        endDt.clearValidators();
        TimeMin.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'NearBySEJInspection': {
        this.tripReportShow = false;
        this.reportDetails = ""
        reportDt.setValidators([Validators.required]);
        selDev.clearValidators();
        startDt.clearValidators();
        endDt.clearValidators();
        TimeMin.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'ExceptionReport': {
        this.reportDetails = "Exception report for today will be available after 6pm."
        this.maxDate = new Date();
        this.tripReportShow = false;
        reportDt.setValidators([Validators.required]);
        selDev.clearValidators();
        startDt.clearValidators();
        endDt.clearValidators();
        TimeMin.clearValidators();
        exceptionRepoType.clearValidators();
        break;
      }
      case 'DateRangeExceptionReport': {
        this.reportForm.patchValue({startDate: (moment().subtract(10, 'days').startOf('day')) })
        this.monthlyReportShow = false;
        this.reportDetails = 'Shows selected exception report for the selected date range (date range max: 10 days)'
        this.showExceptionRepoType = true;
        startDt.setValidators([Validators.required]);
        endDt.setValidators([Validators.required]);
        exceptionRepoType.setValidators([Validators.required]);
        selDev.clearValidators();
        TimeMin.clearValidators();
        reportDt.clearValidators();
        break;
      }
    }//end switch case
    selDev.updateValueAndValidity();
    exceptionRepoType.updateValueAndValidity();
    startDt.updateValueAndValidity();
    endDt.updateValueAndValidity();
    reportDt.updateValueAndValidity();
    TimeMin.updateValueAndValidity();
  }//end reportRequirement method

  getSelectedDevice($event){
    this.selectedImei_no = $event.value.imei_no
    this.chkExpiry = $event.value.remaining_days_to_expire;
    this.selectedDeviceName = $event.value.name;
  }

  hideSeekReportCard(){
    this.showRepoCard = !this.showRepoCard
  }

  getExceptionRepoType(event){
    this.selectedExceptionRepo = event.value;
  }

  getTotlDistance(kms: number){
    this.totalDistance = kms;
  }

  stopMins(stopMins: number){
    this.stoppageMins.push(stopMins);
  }

  downloadFile(){
    //console.log('In download file')
    switch(this.f.reportType.value.Module){
        case 'TripReport': {
                this.excelServ.generateTripExcel(this.selReportType,this.selDeviceName,this.selReportDate,this.tableHeading,
                                                this.tripRepo,this.stoppageMins,this.totalDistance)
                break;
        }//end case-1
        case 'MonthlyMileageReport': {
          this.excelServ.generateTripExcel(this.selReportType,this.selDeviceName,this.selStartDate,this.tableHeading,
                                            this.tripRepo,this.stoppageMins,this.totalDistance,this.selEndDate)
          break;
        }//end case-2
        case 'DeviceOnReport': {
          this.excelServ.generateCurrentStatusExcel(this.selReportType,this.selReportDate,this.deviceOnStatus,this.deviceOffStatus,this.tableHeading,
                                                    this.offDevicesCount,this.onDevicesCount,this.currTime)
          break;                                          
        }//end case-3
        case 'CurrentDeviceStatus': {
          this.excelServ.generateCurrentStatusExcel(this.selReportType,this.selReportDate,this.currOnDevice,this.currOffDevice,this.tableHeading,
                                                    this.offDevicesCount,this.onDevicesCount,this.currTime)
          break;
        }//end case-4
        case 'DeviceOffReport': {
          this.excelServ.generateCurrentStatusExcel(this.selReportType,this.selReportDate,this.deviceOnStatus,this.deviceOffStatus,this.tableHeading,
                                                    this.offDevicesCount,this.onDevicesCount,this.currTime)
          break;
        }//end case-5
        case 'TodayDeviceStatus': {
          this.excelServ.generateCurrentStatusExcel(this.selReportType,this.selReportDate,this.currOnDevice,this.currOffDevice,this.tableHeading,
                                                    this.offDevicesCount,this.onDevicesCount,this.currTime)
          break;
        }
        case 'MonitorSOSPress': {
          this.excelServ.generateMonitorSOSExcel(this.selReportType,this.selReportDate,this.monitorSos,this.tableHeading)
          break;
        }//end case-6
        case 'DeviceONOffStatus': {
          this.excelServ.generateCurrentStatusExcel(this.selReportType,this.selReportDate,this.currOnDevice,this.currOffDevice,this.tableHeading,
            this.offDevicesCount,this.onDevicesCount,this.currTime)
          break;
        }
        case 'DeviceBatteryStatus': {
          this.excelServ.generateMonitorSOSExcel(this.selReportType,this.selReportDate,this.monitorSos,this.tableHeading)
          break;
        }//end case-7
        case 'DateRangeExceptionReport': {
          this.excelServ.generateDateRangeExceptionExcel(this.selectedExceptionRepo,this.DateRangeException,this.tableHeading,this.selStartDate,this.selEndDate)
          break;
        }
    }//end switch case
  }

  setOrderBy(){
    this.reverse = !this.reverse;
  }

  onConfirm(): void{
    this.loading = true;
    let d: Date = new Date();
    this.currTime = d;
    this.DateRangeException =[];
    this.tripRepo = [];
    this.monitorSos = [];
    this.tableHeading = [];
    this.currOnDevice = [];
    this.currOffDevice = []; 
    this.deviceOnStatus = [];
    this.deviceOffStatus = [];
    this.exceptionRepo = [];
    this.currntStatRepoShow = false;
    this.showExceptionRepo = false;
    this.showTripCaption = false;
    this.showSideInfo = false;
    this.showRepoCaption = false;
    this.showCaption = false;
    switch(this.f.reportType.value.Module){
      case 'CurrentDeviceStatus': {
        let currentDt = parseInt(""+d.getTime()/1000)
        let pastMin = this.f.timeInMins.value
        let parentId = this.currentUser.usrId;
        //console.log(currentDt+' '+pastMin+' '+parentId)
        this.reportServ.getDeviceCurrStatReport(currentDt,pastMin,parentId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((data: Array<CurrentStatus>) => {
            //console.log(data)
            if(data.length==0){
              this.loading = false;
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'NoReportFound'
              };
              const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
            }
            else{
              this.currntStatRepoShow = true;
              this.selReportDate = this.d;
              this.selReportType = this.f.reportType.value.ModuleTitle
              data.forEach(res => {
                if(res.deviceOnStatus == 0){
                  this.offDeviceHeader = true;
                 if(res.lat && res.lang){
                    this.reportServ.getAddress(+res.lat, +res.lang)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe((data: any) => {
                          if(data.results[0]){
                            res.address = data.results[0].formatted_address;
                          }
                          else{
                            res.address ="Address not found";
                          }
                      },
                      (error: any) => {
                        const dialogConfig = new MatDialogConfig();
                        //pass data to dialog
                        dialogConfig.data = {
                          hint: 'ServerError'
                        };
                        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
                      }
                    )
                  }
                  else{
                    res.address ="Address not found";
                  }
                  this.currOffDevice.push(res)
                }
                else{
                  this.onDeviceHeader = true;
                  if(res.railFeatureDto == null)
                  {
                    res.location = 'Device is not on railway track.'
                    res.showSection = false;
                    this.currOnDevice.push(res);
                  }
                  else{
                    res.location = parseFloat(res.railFeatureDto.kiloMeter + +res.railFeatureDto.distance/1000).toFixed(2)+'Km And far '+
                                    parseFloat(res.railFeatureDto.NearByDistance).toFixed(2)+' meter from '+res.railFeatureDto.featureDetail;
                    res.section = res.railFeatureDto.section;
                    res.showSection = true;
                    this.reportServ.getAddress(+res.lat, +res.lang)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe((data: any) => {
                          if(data.results[0]){
                            res.address = data.results[0].formatted_address;
                          }
                          else{
                            res.address ="Address not found";
                          }
                      },
                      (error: any) => {
                        const dialogConfig = new MatDialogConfig();
                        //pass data to dialog
                        dialogConfig.data = {
                          hint: 'ServerError'
                        };
                        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
                      }
                    )
                    this.currOnDevice.push(res);
                  }
                }
              })
              this.tableHeading = ['Sr No','Device Name','Device Status','Time','Device Address','Device Latitude','Device Longitude']
            }
           /*  console.log(this.currOnDevice)
            console.log(this.currOffDevice) */
            this.offDevicesCount = this.currOffDevice.length; 
            this.onDevicesCount = this.currOnDevice.length;
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
        break;
      }//end case
      case 'DeviceOnReport': {
        let repoDate = this.f.reportDate.value._d.getTime()/1000;
        let parentId = this.currentUser.usrId;
        this.reportServ.getDeviceOnReport(repoDate,parentId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((data: Array<CurrentStatus>) => {
            if(data.length==0){
              this.loading = false;
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'NoReportFound'
              };
              const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
            }
            else{
              this.currntStatRepoShow = true;
              this.selReportDate = this.f.reportDate.value._d;
              this.selReportType = this.f.reportType.value.ModuleTitle
              data.forEach(res => {
                if(res.deviceOnStatus == 0){
                  this.offDeviceHeader = true;
                  this.deviceOffStatus.push(res)
                }
                else{
                  this.onDeviceHeader = true;
                  if(res.lat && res.lang){
                  this.reportServ.getAddress(+res.lat, +res.lang)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe((data: any) => {
                        if(data.results[0]){
                          res.address = data.results[0].formatted_address;
                        }
                        else{
                          res.address ="Address not found";
                        }
                    },
                    (error: any) => {
                      const dialogConfig = new MatDialogConfig();
                      //pass data to dialog
                      dialogConfig.data = {
                        hint: 'ServerError'
                      };
                      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
                    }
                  )
                  }
                  else
                    res.address ="Address not found";
                  this.deviceOnStatus.push(res)
                }
              })
              this.tableHeading = ['Sr No','Device Name','Device Status','Time','Device Address','Device Latitude','Device Longitude']
            }
            /* console.log(this.deviceOnStatus)
            console.log(this.deviceOffStatus) */
            this.offDevicesCount = this.deviceOffStatus.length; 
            this.onDevicesCount = this.deviceOnStatus.length;
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
        break;
      }//end case
      case 'DeviceOffReport': {
        let repoDate = this.f.reportDate.value._d.getTime()/1000;
        let parentId = this.currentUser.usrId;
        this.reportServ.getDeviceOffReport(repoDate,parentId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((data: Array<CurrentStatus>) => {
            if(data.length==0){
              this.loading = false;
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'NoReportFound'
              };
              const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
            }
            else{
              this.currntStatRepoShow = true;
              this.selReportDate = this.f.reportDate.value._d;
              this.selReportType = this.f.reportType.value.ModuleTitle
              data.forEach(res => {
                if(res.deviceOnStatus == 0){
                  this.offDeviceHeader = true;
                  this.deviceOffStatus.push(res)
                }
                else{
                  this.onDeviceHeader = true;
                  if(res.lat && res.lang){
                  this.reportServ.getAddress(+res.lat, +res.lang)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe((data: any) => {
                        if(data.results[0]){
                          res.address = data.results[0].formatted_address;
                        }
                        else{
                          res.address ="Address not found";
                        }
                    },
                    (error: any) => {
                      const dialogConfig = new MatDialogConfig();
                      //pass data to dialog
                      dialogConfig.data = {
                        hint: 'ServerError'
                      };
                      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
                    }
                  )}
                  else
                    res.address ="Address not found";
                  this.deviceOnStatus.push(res)
                }
              })
              this.tableHeading = ['Sr No','Device Name','Device Status','Time','Device Address','Device Latitude','Device Longitude']
            }
            /* console.log(this.deviceOnStatus)
            console.log(this.deviceOffStatus) */
            this.offDevicesCount = this.deviceOffStatus.length; 
            this.onDevicesCount = this.deviceOnStatus.length;
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
        break;
      }//end case
      case 'TripReport': {
        //if device is not expired then call service to fetch report
        if(this.chkExpiry >= 0){
        let colName;
        let stDt = this.f.reportDate.value._d.getTime()/1000;
        //send end date adding 1 day in date 
        let edDt = new Date(this.f.reportDate.value._d.getFullYear(),this.f.reportDate.value._d.getMonth(),this.f.reportDate.value._d.getDate()+1).getTime()/1000;
        this.reportServ.getTripReport(this.selectedImei_no, stDt, edDt)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((data: Array<TripReportInfo>) => {
              //console.log(JSON.stringify(data));
              if(data.length==0){
                this.loading = false;
                const dialogConfig = new MatDialogConfig();
                //pass data to dialog
                dialogConfig.data = {
                  hint: 'reportNotFound',
                  devName: this.selectedDeviceName
                };
                const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
              }
              else{
                this.selReportDate = this.f.reportDate.value._d;
                this.selReportType = this.f.reportType.value.ModuleTitle
                this.selDeviceName = this.f.selectedDevice.value.name;
                if(this.currentUser.usrId == 532538){
                  data.map(res=>{
                    res.totalkm = (+res.totalkm * 0.621371)+""
                    this.tripRepo.push(res)
                  })
                  colName = 'miles travelled'
                  this.distUnit = 'miles';
                }
                else{
                  colName = 'Kms travelled'
                  this.tripRepo = data;
                  this.distUnit = 'kms';
                }
                this.tableHeading = ['Trip','Start Time','Start Address','End Time','End Address','Stoppage Mins',
                                      'Avg Speed', 'Max Speed', colName]
                this.showCaption = true;
                this.showTripCaption = true;
                this.showSideInfo = true;
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
        else{
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
                  //pass data to dialog
                  dialogConfig.data = {
                    devName: this.selectedDeviceName,
                    hint: 'SubscriptionExpire'
                  };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }//end else
        break;
      }//end case
      case 'MonthlyMileageReport':{
        if(this.chkExpiry >= 0){
        let colName;
        let stDt = this.f.startDate.value._d.getTime()/1000;
        //send end date adding 1 day in date 
        let edDt = new Date(this.f.endDate.value._d.getFullYear(),this.f.endDate.value._d.getMonth(),
                            this.f.endDate.value._d.getDate(),this.f.endDate.value._d.getHours()+24).getTime()/1000;
        this.reportServ.getTripReport(this.selectedImei_no, stDt, edDt)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((data: Array<TripReportInfo>) => {
            //console.log(JSON.stringify(data));
            if(data.length==0){
              this.loading = false;
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'reportNotFound',
                devName: this.selectedDeviceName
              };
              const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
            }
            else{
              this.selStartDate = this.f.startDate.value._d;
              this.selEndDate = this.f.endDate.value._d;
              this.selReportType = this.f.reportType.value.ModuleTitle
              this.selDeviceName = this.f.selectedDevice.value.name;
              if(this.currentUser.usrId == 532538){
                data.map(res=>{
                  res.totalkm = (+res.totalkm * 0.621371)+""
                  this.tripRepo.push(res)
                })
                colName = 'miles travelled'
                this.distUnit = 'miles';
              }
              else{
                colName = 'Kms travelled'
                this.tripRepo = data;
                this.distUnit = 'kms';
              }
              this.tableHeading = ['Trip','Start Time','Start Address','End Time','End Address','Stoppage Mins',
                                    'Avg Speed', 'Max Speed', colName]
              this.showCaption = true;
              this.showTripCaption = true;
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
        else{
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
                  //pass data to dialog
                  dialogConfig.data = {
                    devName: this.selectedDeviceName,
                    hint: 'SubscriptionExpire'
                  };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }//end else                   
        break;
      }//end case
      case 'MonitorSOSPress': {
        //console.log(this.f.reportDate.value._d)
        let repoDate = this.f.reportDate.value._d.getTime()/1000;
        let parentId = this.currentUser.usrId;
        this.reportServ.getMonitorSOSReport(repoDate,parentId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((data: Array<MonitorSos>) => {
              if(data.length==0){
                this.loading = false;
                const dialogConfig = new MatDialogConfig();
                //pass data to dialog
                dialogConfig.data = {
                  hint: 'NoReportFound'
                };
                const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
              }
              else{
                this.selReportDate = this.f.reportDate.value._d;
                this.selReportType = this.f.reportType.value.ModuleTitle
                data.forEach(res => {
                  if(res.lat && res.lang){
                this.reportServ.getAddress(+res.lat, +res.lang)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe((data: any) => {
                        if(data.results[0]){
                          res.address = data.results[0].formatted_address;
                          this.monitorSos.push(res)
                        }
                        else{
                          res.address ="Address not found";
                          this.monitorSos.push(res)
                        }
                    },
                    (error: any) => {
                      const dialogConfig = new MatDialogConfig();
                      //pass data to dialog
                      dialogConfig.data = {
                        hint: 'ServerError'
                      };
                      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
                    }
                  )}
                  else
                    res.address ="Address not found";
                    this.monitorSos.push(res)
                })
                this.tableHeading = ['Sr No','Name','Address','Date & Time','GSM Signal Strength','Speed','Battery Level']
                this.showCaption = true;
                this.showRepoCaption = true;
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
        break;
      }//end case
      case 'DeviceONOffStatus': {
        let repoDate = this.f.reportDate.value._d.getTime()/1000;
        let parentId = this.currentUser.usrId;
        this.reportServ.getDeviceONOffStatus(repoDate,parentId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Array<CurrentStatus>) => {
          //console.log(data)
          if(data.length==0){
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'NoReportFound'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
          else{
            this.currntStatRepoShow = true;
            this.selReportDate = this.f.reportDate.value._d;
            this.selReportType = this.f.reportType.value.ModuleTitle
            data.forEach(res => {
              if(res.deviceOnStatus == 0){
                this.offDeviceHeader = true;
                if(res.lat && res.lang){
                  this.reportServ.getAddress(+res.lat, +res.lang)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe((data: any) => {
                        if(data.results[0]){
                          res.address = data.results[0].formatted_address;
                        }
                        else{
                          res.address ="Address not found";
                        }
                    },
                    (error: any) => {
                      const dialogConfig = new MatDialogConfig();
                      //pass data to dialog
                      dialogConfig.data = {
                        hint: 'ServerError'
                      };
                      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
                    }
                  )
                  }
                  else
                    res.address ="Address not found";
                this.currOffDevice.push(res)
              }
              else{
                this.onDeviceHeader = true;
                if(res.lat && res.lang){
                this.reportServ.getAddress(+res.lat, +res.lang)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe((data: any) => {
                      if(data.results[0]){
                        res.address = data.results[0].formatted_address;
                      }
                      else{
                        res.address ="Address not found";
                      }
                  },
                  (error: any) => {
                    const dialogConfig = new MatDialogConfig();
                    //pass data to dialog
                    dialogConfig.data = {
                      hint: 'ServerError'
                    };
                    const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
                  }
                )
                }
                else
                  res.address ="Address not found";
                this.currOnDevice.push(res)
              }
            })
            this.tableHeading = ['Sr No','Device Name','Device Status','Time','Device Address','Device Latitude','Device Longitude']
            this.loading = false;
          }
          this.offDevicesCount = this.currOffDevice.length; 
          this.onDevicesCount = this.currOnDevice.length;
        },(error: any) => {
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'ServerError'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        })
        break;
      }
      case 'DeviceBatteryStatus': {
        let repoDate = d.getTime()/1000;
        let parentId = this.currentUser.usrId;
        this.reportServ.getBatteryStatusReport(repoDate,parentId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((data : Array<MonitorSos>) => {
            if(data.length==0){
              this.loading = false;
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'NoReportFound'
              };
              const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
            }else{
              
              this.selReportDate = this.d;
              this.selReportType = this.f.reportType.value.ModuleTitle;
              this.monitorSos = data;
              this.tableHeading = ['Sr No','Name','Date & Time','GSM Signal Strength','Battery Level']
              this.showCaption = true;
              this.showRepoCaption = true;
            }
            this.loading = false;
          },
          (error: any) =>{
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'ServerError'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
        )
        break;
      }//end case
      case 'TodayDeviceStatus': {
        let parentId = this.currentUser.usrId;
        this.reportServ.getTodayDeviceStatus(parentId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((data : Array<CurrentStatus>) => {
            if(data.length==0){
              this.loading = false;
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'NoReportFound'
              };
              const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
            }else{
              //console.log(data)
              this.currntStatRepoShow = true;
              this.selReportDate = this.d;
              this.selReportType = this.f.reportType.value.ModuleTitle
              data.forEach(res => {
                if(res.deviceOnStatus == 0){
                  this.offDeviceHeader = true;
                  this.reportServ.getAddress(+res.lat, +res.lang)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe((data: any) => {
                        if(data.results[0]){
                          res.address = data.results[0].formatted_address;
                        }
                        else{
                          res.address ="Address not found";
                        }
                    },
                    (error: any) => {
                      const dialogConfig = new MatDialogConfig();
                      //pass data to dialog
                      dialogConfig.data = {
                        hint: 'ServerError'
                      };
                      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
                    }
                  )
                  this.currOffDevice.push(res)
                }
                else{
                  this.onDeviceHeader = true;
                  if(res.railFeatureDto == null)
                  {
                    res.location = 'Device is not on railway track.'
                    res.showSection = false;
                    this.currOnDevice.push(res);
                  }
                  else{
                    res.location = parseFloat(res.railFeatureDto.kiloMeter + +res.railFeatureDto.distance/1000).toFixed(2)+'Km And far '+
                                    parseFloat(res.railFeatureDto.NearByDistance).toFixed(2)+' meter from '+res.railFeatureDto.featureDetail;
                    res.section = res.railFeatureDto.section;
                    res.showSection = true;
                    this.reportServ.getAddress(+res.lat, +res.lang)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe((data: any) => {
                          if(data.results[0]){
                            res.address = data.results[0].formatted_address;
                          }
                          else{
                            res.address ="Address not found";
                          }
                      },
                      (error: any) => {
                        const dialogConfig = new MatDialogConfig();
                        //pass data to dialog
                        dialogConfig.data = {
                          hint: 'ServerError'
                        };
                        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
                      }
                    )
                    this.currOnDevice.push(res);
                  }
                }
              })
              this.tableHeading = ['Sr No','Device Name','Device Status','Time','Device Address','Device Latitude','Device Longitude']
            }
            this.offDevicesCount = this.currOffDevice.length; 
            this.onDevicesCount = this.currOnDevice.length;
            this.loading = false; 
          }, 
          (error: any) =>{
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'ServerError'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          } 
          )
        break;
      }
      case 'ExceptionReport': {
        //console.log('exception report')
        let repoDate = this.f.reportDate.value._d.getTime()/1000;
        let parentId = this.currentUser.usrId;
        this.reportServ.getExceptionReport(repoDate,parentId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((data: Array<any>) => {
            if(data.length==0){
              this.loading = false;
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'NoReportFound'
              };
              const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
            }
            else{  
              this.selReportDate = this.f.reportDate.value._d;
              this.selReportType = this.f.reportType.value.ModuleTitle;
              data.forEach(res => {
                res.url = res.fileName;
                res.fileName = res.fileName.split("_"+parentId+".xlsx")[0]
                this.exceptionRepo.push(res)
              })
              //console.log(this.exceptionRepo)
              this.exceptionRepo = data;
              this.showCaption = true;
              this.showRepoCaption = true;
              this.showExceptionRepo = true;
              this.loading = false;
            }
          })
        break;
      }//end case
      case 'DateRangeExceptionReport': {
        let timeDiff = this.f.endDate.value._d.getTime() - this.f.startDate.value._d.getTime()
        if(timeDiff >= 864000000){
          this.showExceptionError = true;
          this.loading = false;
          return;
        }
        else{
          this.selStartDate = this.f.startDate.value._d;
          this.selEndDate = this.f.endDate.value._d;
          this.selReportType = this.selectedExceptionRepo;
          this.showExceptionError = false;
          let startTime = this.f.startDate.value._d.getTime()/1000;
          let endTime = Math.floor(this.f.endDate.value._d.getTime()/1000);
          this.reportServ.getDateWiseExceptionReport(this.currentUser.usrId, this.selectedExceptionRepo, startTime, endTime)
              .takeUntil(this.ngUnsubscribe)
              .subscribe((res: Array<any>) => {
                //console.log(res)
                if(res.length == 0){
                  this.loading = false;
                  const dialogConfig = new MatDialogConfig();
                  //pass data to dialog
                  dialogConfig.data = {
                    hint: 'NoReportFound'
                  };
                  const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
                }
                else{
                  this.uniqueDevices = [];
                  this.uniqueTimestamp = [];
                  let obj = [];
                  let message = '', newArray =[], devices = [];
                  let count=0;
                  this.uniqueTimestamp = [...Array.from(new Set(res.map(item => item.timestamp)))];
                  let uniqueDeviceName = [...Array.from(new Set(res.map(item => item.devicesName)))];
                  this.tableHeading = ['Device Name']
                  this.uniqueTimestamp.forEach((time) => {
                    this.tableHeading.push(this.datePipe.transform(time*1000,'dd-MM-yy'))
                  })
                  this.tableHeading.push('Count')
                  let str: string = uniqueDeviceName+""
                  let answ = str.split(',');
                  answ.forEach((obj) =>{
                      if(obj != "")
                      devices.push(obj.trim());
                  });
                  this.uniqueDevices = [...Array.from(new Set(devices))];
                  //console.log(this.uniqueDevices)
                  this.uniqueDevices.forEach((deviceName) => {
                    obj = [];
                    count = 0;
                    obj.push(deviceName)
                    for(let time of this.uniqueTimestamp){
                      newArray = [];
                      message ='';
                      newArray = res.filter(s => s.timestamp === time)
                      for(let data of newArray){
                        if(data.devicesName.includes(deviceName)){
                          if(this.selectedExceptionRepo == 'Low Battery Exception'){
                            message ='LB';
                          }
                          else if(this.selectedExceptionRepo == 'Beat Not Covered Exception'){
                            message='BNC'
                          }
                          else if(this.selectedExceptionRepo == 'Off Device Exception'){
                            message='Off'           
                          }
                          else if(this.selectedExceptionRepo == 'Overspeed Exception'){
                            message='OS'            
                          }
                        }
                      }
                      if(message.includes('LB') || message.includes('BNC') || message.includes('Off') || message.includes('OS')){
                        obj.push(message)
                        count++;
                      }
                      else{
                        message = '-'
                        obj.push(message)
                      }
                    }
                    obj.push(count)
                    this.DateRangeException.push(obj)
                  })
                  this.showCaption = true;
                  this.showTripCaption = true;
                }
              }, (err) => {
                this.loading = false;
                const dialogConfig = new MatDialogConfig();
                //pass data to dialog
                dialogConfig.data = {
                  hint: 'ServerError'
                };
                const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
            })
        }
        this.loading = false;
        break;
      }//end case
      default: {
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'NoAccessToReport'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        break;
      }
    }//end switch
  }//end onConfirm() method

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
