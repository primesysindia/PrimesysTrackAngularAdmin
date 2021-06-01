import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-history-not-found',
  templateUrl: './history-not-found.component.html',
  styleUrls: ['./history-not-found.component.css']
})


export class HistoryNotFoundComponent implements OnInit {

  deviceName: string;
  msg: string;
  message: string;
  messages: string;
  iconName: string;
  email: string = 'contact@primesystech.com';
  subExp:boolean = false;
  safeHtml: SafeHtml = '';
  driverName: string;
  command: string;
  commandResponse: string;
  deviceImei: string;
  devName: string;
  ticketId: any;
  resMessage: any;

  constructor(private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<HistoryNotFoundComponent>,
    @Inject(MAT_DIALOG_DATA) data        
    ) {
      this.msg =data.hint; 
      this.deviceName = data.devName;
      this.driverName = data.driverNm;
      this.command = data.command;
      this.commandResponse = data.event;
      this.deviceImei = data.device;
      this.ticketId = data.ticketId;
      this.message = data.message;
    }
  

  ngOnInit() {
    if(this.msg == 'reportNotFound')
    {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Ooops...Report not found for '+this.deviceName+' device'
    }
    else if(this.msg == 'NoReportFound'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = "Ooops.. Report not found"
    }
    else if(this.msg == 'locationNotFound'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml('Ooops... Location not found for all devices. Please switch ON all devices.<br/>'+
                      'OR Your subscription for devices get expired.'+
                      'Please contact to admin on <a href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@primesystech.com" target="_blank">contact@primesystech.com</a>')
    }
    else if(this.msg == 'downloadReport'){
      this.iconName = 'sentiment_satisfied_alt'
      this.message = "Report downloaded successfully... Please check in downloads folder."
    }
    else if(this.msg == 'ServerError'){
      this.iconName = 'error_outline'
      this.message = "Your network might be slower. Please refresh page."
    }
    else if(this.msg == 'SubscriptionExpire'){
      this.subExp = true;
      this.iconName = 'notification_important'
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml('Your subscription for '+this.deviceName+' device has expired.<br/>'+
                      'Please contact to admin on <a href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@primesystech.com" target="_blank">contact@primesystech.com</a>')
    }
    else if(this.msg == 'liveLocationNotFound'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Location not found for '+this.deviceName+' device'
    }
    else if(this.msg == 'NoAccessToReport'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'No such report available'
    }
    else if(this.msg == 'feedbackSent'){
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Thank you for your valuable feedback.'
    }
    else if(this.msg == 'DeviceNotRegister'){
      this.subExp = true;
      this.iconName = 'notification_important'
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml('The device is not registered for '+this.deviceName+'.</br>'+
                      'Please contact to admin on <a href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@primesystech.com" target="_blank">contact@primesystech.com</a>')
    }
    else if(this.msg == 'feedbackNotSent'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Feedback not submitted... Please send again.'
    }
    else if(this.msg == 'EmpNotAdded'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Employee not added... Please try again after sometime.'
    }
    else if(this.msg == 'EmpAdded'){
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Employee added successfully.'
    }
    else if(this.msg == 'NoInternetConnection'){
      this.iconName = 'warning'
      this.message = 'You are offline... Please check your internet connection and refresh the page.'
    }
    else if(this.msg == 'NoDeviceList'){
      this.iconName = 'warning'
      this.message = 'Ooops... No devices found for you...!'
    }
    else if(this.msg == 'NoTaskFound'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Oops... No Tasks found for '+this.driverName
    }
    else if(this.msg == 'taskCopied'){
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Tasks added successfully for '+this.driverName
    }
    else if(this.msg == 'NoParentList') {
      this.iconName = 'warning'
      this.message = 'Data not found..Please refresh the page!!' 
    }
    else if(this.msg == 'NoStudentList') {
      this.iconName = 'warning'
      this.message = 'Ooops... student list not found...!' 
    }
    else if(this.msg == 'BeatAdded') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Beat Added Successfully!!' 
    }
    else if(this.msg == 'BeatNotAdded'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Beat not added..please try again.'
    }
    else if(this.msg == 'BeatUpdated') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Beat Updated Successfully!!' 
    }
    else if(this.msg == 'BeatNotUpdated') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Beat Not Updated..please try again' 
    }
    else if(this.msg == 'HierarchyNotAdded'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Hierarchy not added... Please try again.'
    }
    else if(this.msg == 'HierarchyAdded') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Hierarchy Added Successfully!!' 
    }
    else if(this.msg == 'HierarchyNotUpdated'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Hierarchy not updated... Please try again.'
    }
    else if(this.msg == 'HierarchyUpdated') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Hierarchy Updated Successfully!!' 
    }
    else if(this.msg == 'NotFound') {
      this.iconName = 'warning'
      this.message = 'No Issue History found..!!' 
    }
    else if(this.msg == 'showButtonValue') {
      this.iconName = 'sentiment_satisfied_alt'
      this.messages = 'You have selected <strong>' +this.command+ '</strong>'
    }
    else if(this.msg == 'IssueAdded') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Issue Registered Successfully for '+this.ticketId+'!!'
    }
    else if(this.msg == 'TripNotAdded') {
      this.iconName = 'warning'
      this.message = 'Trip Not Added.. Try Again!!' 
    }
    else if(this.msg == 'TripAdded') {
      this.iconName = 'sentiment_satisfied_alt'
      this.messages = 'Trip Added Successfully!!'
    }
    else if(this.msg == 'IssueNotAdded') {
      this.iconName = 'warning'
      this.message = 'Issue Not Added.. Try Again!!' 
    }
    else if(this.msg == 'deviceResponse') {
      this.iconName = 'sentiment_satisfied_alt'
      this.messages = '<strong>' +this.commandResponse+ '</strong>'
      this.devName = '<strong>' +this.deviceImei+ '</strong>'
    }
    
    else if(this.msg == 'errors') {
      this.iconName = 'warning'
      this.message = 'Error..Please check the entered values!!' 
    }
    else if(this.msg == 'StudentAdded') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Student Name Updated Successfully!!' 
    }
    else if(this.msg == 'StudentNotAdded') {
      this.iconName = 'warning'
      this.message = 'Student Not Updated !!' 
    }
    else if(this.msg == 'InvalidStudent') {
      this.iconName = 'warning'
      this.message = 'Device name cannot be same..  Please Check' 
    } 
    else if(this.msg == 'StudentNotExchanged') {
      this.iconName = 'warning'
      this.message = 'Device not exchanged.. Try Again' 
    }
    else if(this.msg == 'StudentExchanged') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Device exchanged successfully !!' 
    }
    else if(this.msg == 'issueNotUpdated') {
      this.iconName = 'warning'
      this.message = 'Issue Not Updated!!' 
    }
    else if(this.msg == 'IssueUpdated') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Issue Updated Successfully!!'
    }
    else if(this.msg == 'cmndHistoryNotFound') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Command History Not Found!!' 
    }
    else if(this.msg == 'issueHistoryNotFound') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Issue History Not Found!!' 
    }
    else if(this.msg == 'BeatNotFound') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Beat Not Found!!' 
    }
    else if(this.msg == 'depHieNotFound') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Department Hierarchy Not Found!!' 
    }
    else if(this.msg == 'commandNotFound') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Command List Not Found!!' 
    }
    else if(this.msg == 'IssuelistNotFound') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Issue List Not Found!!' 
    }
    else if(this.msg == 'exchHistoryNotFound') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Device Exchange History Not Found!!' 
    }
    else if(this.msg == 'MailNotSent') {
      this.iconName = 'warning'
      this.message = 'Mail not sent!!' 
    }
    else if(this.msg == 'MailSent') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Mail Sent Successfully!!'
    }
    else if(this.msg == 'batteryDataNotFound') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Battery Info not found!!'
    }
    else if(this.msg == 'PaymentNotDone') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Payment Not Done!!'
    }
    else if(this.msg == 'PaymentDone') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Payment Done Successfully!!'
    }
    else if(this.msg == 'notDeleted') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Beat not deleted!!'
    }
    else if(this.msg == 'Deleted') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Beat Deleted Successfully!!'
    }
    else if(this.msg == 'hierachyDataNotFound') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Hierarchy Not Found!!' 
    }
    else if(this.msg == 'unregisteredUnsuccessful') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Device Unregistered not successful!!'
    }
    else if(this.msg == 'unregisteredSuccessful') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Device Unregistered Successfully!!'
    }
    else if(this.msg == 'DeviceNotRemoved') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Device not Removed!!'
    }
    else if(this.msg == 'DeviceRemoved') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Device Removed Successfully!!'
    }
      else if(this.msg == 'deviceNotAdded') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = this.message
    }
    else if(this.msg == 'deviceAdded') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message =  this.message+'!!'
    }
    else if(this.msg == 'NoReportFound') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Report Not Found!!'
    }
    else if(this.msg == 'RegisterUnsuccessful') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = this.message+'!!'
    }
    else if(this.msg == 'RegisterSuccessful') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = this.message+'!!'
    }
    else if(this.msg == 'DataNotAdded') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Data Not Added!!'
    }
    else if(this.msg == 'DataAdded') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Data Added Successfully!!'
    }
    else if(this.msg == 'DataNotFound') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Data Not Found!!'
    }
    else if(this.msg == 'DataUpdated') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Data Updated Successfully!!'
    }
    else if(this.msg == 'DataNotUpdated') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Data Not Updated!!'
    }
    else if(this.msg == 'moduleAdded') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Module Added Successfully!!'
    }
    else if(this.msg == 'moduleNotAdded') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Module Not Added!!'
    }
    else if(this.msg == 'moduleUpdated') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Module Updated Successfully!!'
    }
    else if(this.msg == 'moduleNotUpdated') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Module Not Updated!!'
    }
    else if(this.msg == 'EnabledUnsuccessful') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Device not enabled!!'
    }
    else if(this.msg == 'EnableSuccessful') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Device Enabled Successfully!!'
    }
    else if(this.msg == 'utilityNotFound') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Utility Not found!!'
    }
    else if(this.msg == 'UtilityNotMapping') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Utility not Mapped!!'
    }
    else if(this.msg == 'UtilityMapped') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Utility Mapped Successfully!!'
    }
    else{
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Sorry...Tracking history not found for '+this.deviceName+' device'
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
