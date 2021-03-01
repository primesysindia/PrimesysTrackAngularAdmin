import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { FeedbackService } from '../services/feedback.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  feedbackForm: FormGroup;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(fb: FormBuilder, private dialog: MatDialog, private feedServ: FeedbackService) {
    this.feedbackForm = fb.group({
      userRate: 'Very Satisfied',
      serviceUse: 'Daily',
      aspect: 'Quality',
      company: 'Much Better',
      likeProduct: '',
      suggestion: '',
    });
  }

  ngOnInit() {
  }

  get f() { return this.feedbackForm.controls; }

  submitFeedback(){
    this.feedServ.sendFeedback(this.f.userRate.value,this.f.serviceUse.value,this.f.aspect.value,this.f.company.value,this.f.likeProduct.value,this.f.suggestion.value)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((res: any) => {
            //console.log(res)
            if(res.error == 'false'){
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'feedbackSent'
              };
              const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
              this.feedbackForm.reset()
            }
            else{
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'feedbackNotSent'
              };
              const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
            }            
          },(err) => {
            console.log(err)
          }
      )
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
