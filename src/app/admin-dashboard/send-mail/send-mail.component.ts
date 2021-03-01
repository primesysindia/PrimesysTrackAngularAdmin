import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BeatServiceService } from '../../services/beat-service.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { Message } from 'src/app/core/message.model';

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.css']
})
export class SendMailComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  sendMailForm: FormGroup;
  loading: boolean = false;
  mailFormat: any;
  sub: any;
  msg: any;

  constructor(public dialogRef: MatDialogRef<SendMailComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data,       
     private fb: FormBuilder,
     private beatService: BeatServiceService,) { }

  ngOnInit() {
    this.sendMailForm = this.fb.group({
      'sendTo': ['', Validators.required],
      'cc': [''],
      'subject':['', Validators.required],
      'compose': ['', Validators.required]
    })
    this.getMailFormat();

  }

  // get email format and show in dropdown
  getMailFormat() {
    this.beatService.GetSampleMailFormat()
  .takeUntil(this.ngUnsubscribe)
  .subscribe((data: any)=> {
    if(data.length == 0){
      this.loading = false;
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.data = {
        hint: 'IssuelistNotFound'
      };
      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
    } else {
      this.loading = false;
      this.mailFormat = data; 
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

  // on format click get its value
  optionClicked(event: Event, format) {
    
    this.sub =format.subject;
    this.msg = format.message;
    // console.log("mail", this.msg)

    this.sendMailForm.setValue({
      sendTo: '',
      cc: '',
      subject: this.sub,
      compose: this.msg
    });
  }

  // send mail function
  sendMail(){
    if(this.sendMailForm.invalid)
      return
    else{
      this.loading = true;
      this.beatService.generateMail(this.sendMailForm.value)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: Message)=>{
        if(data.error == "true"){
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'MailNotSent'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        } else {
          this.dialogRef.close();
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
        //pass data to dialog
          dialogConfig.data = {
            hint: 'MailSent'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
      })
    }
  }

  resetForm(){
    this.sendMailForm.reset();
  }

  // on click close the dialog box
  onNoClick() {
    this.dialogRef.close()
  }

}
