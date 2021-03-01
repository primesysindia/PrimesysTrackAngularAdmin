import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-command-module',
  templateUrl: './custom-command-module.component.html',
  styleUrls: ['./custom-command-module.component.css']
})
export class CustomCommandModuleComponent implements OnInit {
  msg: any;
  command: any;
  GpsOnWithTime: boolean = false;
  SetFamilyNo: boolean = false;
  SetPeriod: boolean = false;
  setGMT: any;
  SetSOSNo: any;
  SetTimer: any;
  SetHbt: any;
  SetPowerOn: any;
  SetPowerOff: any;
  SetLowBatAlm: any;
  setSosAlarm: any;
  setSimChangeAlm:  any;
  setWeeklyPeriod: any;
  OtherCommand: boolean = false;
  gpsForm: FormGroup;
  setFamilyNo: FormGroup;
  setGMTForm: FormGroup;
  setSOSNoForm: FormGroup;
  SetTimerForm: FormGroup;
  SetHbtForm: FormGroup;
  setTimePeriodForm: FormGroup;
  SetOtherCommandForm: FormGroup;
  SetPowerOnForm: FormGroup;
  SetPowerOffForm: FormGroup;
  lowBatteryForm: FormGroup;
  sosAlarmForm: FormGroup;
  simChangeAlmForm: FormGroup;
  setWeeklyPertiodForm: FormGroup;

  constructor(private sanitizer: DomSanitizer, public fb: FormBuilder, 
    public dialogRef: MatDialogRef<CustomCommandModuleComponent>,
    @Inject(MAT_DIALOG_DATA) data        
    ) {
      this.msg =data.hint; 
      this.command = data.command;
    }

  ngOnInit() {
    this.gpsForm = this.fb.group({
      gpsOn: ['', Validators.required],
    });

    this.setFamilyNo = this.fb.group({
      FN1: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      FN2: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      FN3: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
    });

    this.setGMTForm = this.fb.group({
      hour: ['', Validators.required],
      minute: ['', Validators.required]
    });

    this.setSOSNoForm = this.fb.group({
      SOS1: ['', Validators.required],
      SOS2: ['', Validators.required],
      SOS3: '9766711066'
    });

    this.SetPowerOnForm = this.fb.group({
      on_offStatus: ['', Validators.required],
      one_zeroStatus: ['', Validators.required]
    })
    
    this.SetPowerOffForm = this.fb.group({
      on_offStatus: ['', Validators.required],
      one_zeroStatus: ['', Validators.required]
    })

    this.lowBatteryForm = this.fb.group({
      on_offStatus: ['', Validators.required],
      one_zeroStatus: ['', Validators.required]
    })
    
    this.sosAlarmForm = this.fb.group({
      on_offStatus: ['', Validators.required],
      one_zeroStatus: ['', Validators.required]
    })

    this.simChangeAlmForm = this.fb.group({
      on_offStatus: ['', Validators.required],
      one_zeroStatus: ['', Validators.required]
    })

    this.SetTimerForm = this.fb.group({
      'lbsTimer': ['', Validators.required],
      'GPSTimer': ['', Validators.required]
    })

    this.SetHbtForm = this.fb.group({
      'hbt': ['', Validators.required]
    })

    this.setTimePeriodForm = this.fb.group({
      // 'selectDay': ['', Validators.required],
      'startTime1': ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      'endTime1': ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      'startTime2': ['', Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)],
      'endTime2': ['', Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]
    })

    this.setWeeklyPertiodForm = this.fb.group({
      'selectDay': ['', Validators.required],
      'startTime1': ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      'endTime1': ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      'startTime2': ['', Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)],
      'endTime2': ['', Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]
    })

    this.SetOtherCommandForm = this.fb.group({
      'otherCommand': ['', Validators.required]
    })

    if(this.msg == 'GpsOnWithTime'){
      this.GpsOnWithTime = true;
    }
    else if(this.msg ==  'SetFamilyNo') {
      this.SetFamilyNo = true;  
    }
    else if (this.msg == 'SetGMT') {
      this.setGMT = true;
    } 
    else if (this.msg == 'SetSOS') {
      this.SetSOSNo = true;
    } 
    else if(this.msg == 'SetTimer'){
      this.SetTimer = true;
    }
    else if(this.msg == 'SetHBT'){
      this.SetHbt = true;
    }
    else if(this.msg == 'SetPeriod'){
      this.SetPeriod = true;
    }
    else if(this.msg == 'PowerOnAlm') {
      this.SetPowerOn = true;
    }
    else if (this.msg == 'PowerOffAlm') {
      this.SetPowerOff = true;
    }
    else if (this.msg == 'lowBatteryAlm') {
      this.SetLowBatAlm = true;
    }
    else if (this.msg == 'sosAlarm') {
      this.setSosAlarm = true;
    }  
    else if (this.msg == 'simChangeAlm') {
      this. setSimChangeAlm = true;
    }
    else if(this.msg == 'other'){
      this.OtherCommand = true;
    }
    else if(this.msg == 'setWeeklyPeriod'){
      this.setWeeklyPeriod = true;
    }
  }
  get f(){
    return this.setFamilyNo.controls;
  }

  get p(){
    return this.setTimePeriodForm.controls;
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.setFamilyNo.controls[controlName].hasError(errorName);
  }

  public hasErrorInSetPeriod = (controlName: string, errorName: string) =>{
    return this.setTimePeriodForm.controls[controlName].hasError(errorName);
  }

  public hasErrorInWeeklySetPeriod = (controlName: string, errorName: string) =>{
    return this.setWeeklyPertiodForm.controls[controlName].hasError(errorName);
  }

  dialogClose() {
    this.dialogRef.close();
  }

  // create command and submit for GPSON
  submitGPSOn() {
    var command = 'GPSON';
    var formValue = this.gpsForm.get('gpsOn').value;
    var data = command + ',' +  formValue +'#'
    this.dialogRef.close({action: 1, data: data}); 
  }

  // create and submit for Set Family Number
  saveFamilyNo() {
    if (this.setFamilyNo.invalid) {
      return
    } else {
      var data = 'FN,A,' + 'PAPA,' + this.setFamilyNo.get('FN1').value + ',' + 'MUMMY,' +
     + this.setFamilyNo.get('FN2').value + ',' + 'UNCLE,' + this.setFamilyNo.get('FN3').value + '#';
    this.dialogRef.close({action: 1, data: data}); 
    }
  }

  // create command and submit for GMT 
  saveGMT() {
    var data = 'GMT'+',' + 'E' + ',' + this.setGMTForm.get('hour').value + ',' + 
    this.setGMTForm.get('minute').value + '#'
    this.dialogRef.close({action: 1, data: data}); 
  }

  // create Command and submit for Set SOS
  saveSOS() {
    if(this.setSOSNoForm.invalid) {
      return;
    } else {
    var data = 'SOS,A'+ ',' +  this.setSOSNoForm.get('SOS1').value + ',' 
    +  this.setSOSNoForm.get('SOS2').value + ',' +  this.setSOSNoForm.get('SOS3').value + '#';
    this.dialogRef.close({action: 1, data: data}); 
    }
  }
  // set lbs and gps timer
  saveLbsGpsTime() {
    var data = 'TIMER,' + this.SetTimerForm.get('lbsTimer').value + ',' + this.SetTimerForm.get('GPSTimer').value + '#';
    this.dialogRef.close({action: 1, data: data}); 
  }
// create and submit command to set HBT timer
  saveHbtTime() {
    var data = 'HBT,' +  this.SetHbtForm.get('hbt').value + '#';
    this.dialogRef.close({action: 1, data: data}); 

  }

  timeArray: any = [];
  // create and submit command to set period
  savePeriodTime() {
    if(this.setTimePeriodForm.invalid) {
      return;

    } else {
    for (var i=0; i<=2 ; i++) {
       if (this.setTimePeriodForm.get('startTime2').value && this.setTimePeriodForm.get('endTime2').value) {
          var data = 'PERIOD,1,1,' + i + ',' 
          + this.setTimePeriodForm.get('startTime1').value + '-' + this.setTimePeriodForm.get('endTime1').value + ',' 
          + this.setTimePeriodForm.get('startTime2').value + '-' + this.setTimePeriodForm.get('endTime2').value + '#'
          this.timeArray.push(data)
          this.dialogRef.close({action: 1, data: this.timeArray}); 

      } else {
          var data = 'PERIOD,1,1,' + i + ',' 
          + this.setTimePeriodForm.get('startTime1').value + '-' + this.setTimePeriodForm.get('endTime1').value + '#'
          this.timeArray.push(data)
          this.dialogRef.close({action: 1, data: this.timeArray});           
        }
    }
  }
  }

  saveOtherCommand() {
    var data = this.SetOtherCommandForm.get('otherCommand').value;
    this.dialogRef.close({action: 1, data: data}); 
  }

  // save power on alarm command
  savePowerOnCommand() {
    if(this.SetPowerOnForm.invalid) {
      return;
    } else {
    var data = 'PWRONALM'+ ',' +  this.SetPowerOnForm.get('on_offStatus').value + ',' 
    +  this.SetPowerOnForm.get('one_zeroStatus').value + ','  + '#';
    this.dialogRef.close({action: 1, data: data}); 
    }
  }

   // save power off alarm command
   savePowerOffCommand() {
    if(this.SetPowerOffForm.invalid) {
      return;
    } else {
    var data = 'PWROFFALM'+ ',' +  this.SetPowerOffForm.get('on_offStatus').value + ',' 
    +  this.SetPowerOffForm.get('one_zeroStatus').value + ','  + '#';
    this.dialogRef.close({action: 1, data: data}); 
    }
  }

  // low battery command
  saveLowBatteryOnCommand() {
    if(this.lowBatteryForm.invalid) {
      return;
    } else {
    var data = 'BATALM'+ ',' +  this.lowBatteryForm.get('on_offStatus').value + ',' 
    +  this.lowBatteryForm.get('one_zeroStatus').value + ','  + '#';
    this.dialogRef.close({action: 1, data: data}); 
    }
  }

// sos on/off alarm command
  savesosAlarmCommand() {
    if(this.sosAlarmForm.invalid) {
      return;
    } else {
    var data = 'SOSALM'+ ',' +  this.sosAlarmForm.get('on_offStatus').value + ',' 
    +  this.sosAlarmForm.get('one_zeroStatus').value + ','  + '#';
    this.dialogRef.close({action: 1, data: data}); 
    }
  }
  
  // sim change on/off alarm
  simChangeAlarmCommand() {
    if(this.simChangeAlmForm.invalid) {
      return;
    } else {
    var data = 'SIMALM'+ ',' +  this.simChangeAlmForm.get('on_offStatus').value + ',' 
    +  this.simChangeAlmForm.get('one_zeroStatus').value + ','  + '#';
    this.dialogRef.close({action: 1, data: data}); 
    }
  }

  saveWeeklyPeriodTime() {
    if(this.setWeeklyPertiodForm.invalid) {
      return;

    } else if(this.setWeeklyPertiodForm.get('startTime2').value && this.setWeeklyPertiodForm.get('endTime2').value) {
        var data = 'PERIOD,1,1,' + this.setWeeklyPertiodForm.get('selectDay').value + ',' 
        + this.setWeeklyPertiodForm.get('startTime1').value + '-' + this.setWeeklyPertiodForm.get('endTime1').value + ',' 
        + this.setWeeklyPertiodForm.get('startTime2').value + '-' + this.setWeeklyPertiodForm.get('endTime2').value + '#'
        this.dialogRef.close({action: 1, data: data}); 

    } else {
        var data = 'PERIOD,1,1,' + this.setWeeklyPertiodForm.get('selectDay').value + ',' 
        + this.setWeeklyPertiodForm.get('startTime1').value + '-' + this.setWeeklyPertiodForm.get('endTime1').value + '#'
        this.dialogRef.close({action: 1, data: data}); 
        
      }
  }
}
