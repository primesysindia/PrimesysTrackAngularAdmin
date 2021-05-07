import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { BeatServiceService } from '../../services/beat-service.service';
import * as XLSX from 'xlsx';
import { MatDialog, MatDialogConfig, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import { Message } from 'src/app/core/message.model';

@Component({
  selector: 'app-add-keymen-mutiple-beat',
  templateUrl: './add-keymen-mutiple-beat.component.html',
  styleUrls: ['./add-keymen-mutiple-beat.component.css']
})
export class AddKeymenMutipleBeatComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  excelUrl: string = 'http://primesystech.com/PrimesysTrackReport/TemplatesFiles/KeymanBulkTemplate.xlsx'
  // excelUrl: string = 'http://primesystech.com/PrimesysTrackReport/TemplatesFiles/AddBulkDevice_template.xlsx'
  showMultipleBeatsBtn: boolean = false;
  file: File;
  arrayBuffer: any;
  filelist: any;
  fetchedData: any = [];
  loading : boolean = false;
  addBulkKeymanForm: FormGroup;
  currUser: any;
  usrLoginId: any;
  parId: any;

  constructor(
    private beatService: BeatServiceService, private fb: FormBuilder, public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddKeymenMutipleBeatComponent>,
    @Inject(MAT_DIALOG_DATA) data   
    ){
      this.parId = data.params
    }

  ngOnInit() {
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.usrLoginId = this.currUser.usrId;

    this.addBulkKeymanForm = this.fb.group({
      'name': ['Support Team'],
      'contactNo': ['7350376543'],
      'email': ['contact@primesystech.com'],
      'start_time': ['', Validators.required],
      'end_time': ['', Validators.required],
      'file': ['', Validators.required]
    })
  }

  addfile(event)     
  {    
    this.file= event.target.files[0];     
    let fileReader = new FileReader();    
    fileReader.readAsArrayBuffer(this.file);     
    fileReader.onload = (e) => {    
      this.arrayBuffer = fileReader.result;    
      var data = new Uint8Array(this.arrayBuffer);    
      var arr = new Array();    
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
      var bstr = arr.join("");    
      var workbook = XLSX.read(bstr, {type:"binary"});    
      var first_sheet_name = workbook.SheetNames[0];    
      var worksheet = workbook.Sheets[first_sheet_name];    
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:false}));    
        this.fetchedData = XLSX.utils.sheet_to_json(worksheet,{raw:false});
        console.log("arraylist",  this.fetchedData);
            this.filelist = []; 
    }    
  }   

  addKeymanBulkBeat() {
    let params = {
      parentId : this.parId,
      userLoginId: this.usrLoginId,
      keymenformArray: this.fetchedData
    }
      // Close the dialog, return true
      this.loading = true;
    var data = Object.assign(this.addBulkKeymanForm.value,params);
     this.beatService.saveKeymenBeatsInBulk(data).takeUntil(this.ngUnsubscribe)
      .subscribe((data: Message)=>{
        console.log("data", data)
         if(data.error == "true"){
          this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'beatNotAdded'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
          else {
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'beatAdded'
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
          this.loading = false;
      })
    }

    onNoClick() {
      this.dialogRef.close();
    }

    resetForm () {
      this.addBulkKeymanForm.reset();
    }

  }

