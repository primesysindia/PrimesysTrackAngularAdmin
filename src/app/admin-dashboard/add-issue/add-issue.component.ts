import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output ,AfterViewInit,  OnDestroy } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { issuesTitleList } from '../../core/post';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_FORMATS } from 'ng-pick-datetime-moment';
import { BeatServiceService } from '../../services/beat-service.service';
import { DatePipe } from '@angular/common';
import { Message } from 'src/app/core/message.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { LiveLocationService } from '../../services/live-location.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import 'rxjs/observable/of';

const moment = (_moment as any).default ? (_moment as any).default : _moment;
;

@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.css'],
  providers: [DatePipe]
})
export class AddIssueComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public dateTime = new moment();
  public issueFilterCtrl: FormControl = new FormControl();
  /** list of devices filtered by search keyword */
  public filteredIssueList: ReplaySubject<issuesTitleList[]> = new ReplaySubject<issuesTitleList[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  
  addIssueForm: FormGroup;
  issue: any;
  showDescription: boolean = false;
  description: any;
  userLoginName: any;
  currUser: any;
  myDate = new Date();
  commandData: any;
  todayDate : Date = new Date();
  loading: boolean;
  commands: any; student: any;
  imeiNo: any;
  response: any = [];
  devName: any;
  responseData: any;
  resStudentId: any;
  resMessage: any;
  showTable: boolean = false;
  showButton: boolean = false;
  studId: any;
  devData: any;
  userId: any;
  // base64textString: any;
  private base64textString: string = '';
  fileArray: any=[];
  filesName: any;
  resp : any;
  showRespTable: boolean = false;
  urls:any = [];
  fileEncoded: any;
  fileName: any;
  fileExt: any;
  filesId: any = [];
  fileIdArray: any = [];
  fileIDs: any;

  constructor(
    // public dialogRef: MatDialogRef<AddIssueComponent>, 
    public dialog: MatDialog,
    // @Inject(MAT_DIALOG_DATA) data,       
     private fb: FormBuilder, 
     private beatService: BeatServiceService,
     private liveLocServ: LiveLocationService, 
     private datePipe: DatePipe,private http: HttpClient,
     private router: Router) {
        // this.studId = data.studentId,
        // this.imeiNo = data.imeiNo,
        // this.devName = data.deviceName
      }
  

  ngOnInit() {
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'))
    this.userLoginName = this.currUser.userName;
    this.userId = this.currUser.usrId;
    this.devData = JSON.parse(localStorage.getItem('DeviceInfo'))
    this.studId = this.devData.student_id;
    this.imeiNo = this.devData.imei_no;
    this.devName = this.devData.name;
 
    this.initIoConnection();

    this.addIssueForm = this.fb.group({
      // 'issue': ['', Validators.required],
      'status': ['', Validators.required],
      'priority': ['', Validators.required],
      'caller_name': ['', Validators.required],
      'contact': ['', Validators.required],
      'description': ['', Validators.required],
      'isDeviceOn': new FormControl(0),
      'isDeviceButtonOn': new FormControl(0),
      'isBatteryOn': new FormControl(0),
      'IsImeiSIMCorrect': new FormControl(0),
      'IsGSMOn': new FormControl(0),
      'isGpsOn': new FormControl(0),
    })
  }

  // initiate socket connection
  private initIoConnection(): void{
    let webSocketUrl = 'ws://'+this.currUser.socketUrl+':'+environment.portNo+'/bullet';
    this.liveLocServ.initSocket(webSocketUrl);  
    this.getIssueList();
  }
  

  // get issue master list
  getIssueList() {
    this.beatService.GetIssueList()
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
        this.issue = data;
        this.issueFilter();
        this.getCommandsList();
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

  issueFilter() {
    // load the initial device list
    this.filteredIssueList.next(this.issue);
    // console.log("filteredlist", this.filteredIssueList);

    // listen for search field value changes
    this.issueFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterIssueLists();
      });
  }

  protected filterIssueLists() {
    if (!this.issue) {
      return;
    }
    // get the search keyword
    let search = this.issueFilterCtrl.value;
    if (!search) {
      this.filteredIssueList.next(this.issue.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the list
    this.filteredIssueList.next(
      this.issue.filter(issue => issue.issueTitle.toLowerCase().indexOf(search) > -1)
    );
  }
  // get configuration command list
  getCommandsList() {
    this.loading = true;
    this.beatService.getDevicesCommand().subscribe((res: any) =>{
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'commandNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.loading = false;
        this.commandData = res;
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
  
  // get command description on click
  onOptionClicked(event: Event, command) {
    this.commands = command.command;
    this.showDescription = true;
  }
  message: any;
  device: any;
  name: any;
  std_id: any;
  secondMsg: any;
  finalMsg: any;
  respMsg: any = [];
  cmdSuccessMsg: any;
  deviceResponseMsg: any;

    //send command to socket 
    sendCommand() {
      let input = {
        "event":"start_track",
        "student_id": +this.studId
      }
      // console.log("inp", input)

      this.liveLocServ.sendMsg(input);
        var inputData =  {
          "event":"send_command",
          "student_id": +this.studId,
          "data":{
            "command": this.commands,
            "device":this.imeiNo,
            "deviceName": this.devName,
            "loginName": this.userLoginName
          }
        }
    // console.log("inputData", inputData)
    this.liveLocServ.sendMsg(inputData)
    this.liveLocServ.messages.takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        this.response = res;
        this.showButton = true;
        this.responseData = JSON.parse(this.response.data);
          this.showTable = true;
        if(this.responseData.event == 'send_command_status') {
          this.showTable = true;
            this.message = this.responseData.msg;
            this.device = this.responseData.device;
            this.name = this.responseData.name;
            this.std_id = this.responseData.studentId;
            // console.log("res", this.responseData)
        } else  {
          this.showTable = true;
          this.secondMsg = this.responseData.msg;
          //  console.log("responsedata", this.responseData)
        }
      })
    }

    issueMstrId: any;
    // onclick of issue get its description
    optionClicked(event: Event, issue) {
      this.issueMstrId = issue.isseMasterId
      this.description = issue.description;
      this.showDescription = true;
    }

    onSelectFile(e) {
      var files = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
      if (e.target.files && e.target.files[0]) {
      var filesAmount = e.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          reader.onload = this._handleReaderLoaded.bind(this);
          reader.readAsDataURL(files);
                        this.fileName = e.target.files[i].name;
                        this.fileExt = e.target.files[i].name.split('.').pop();
                        console.log("this.fileName", this.fileName)
                        console.log("this.fileExt", this.fileExt)
        }
      }
    }
    _handleReaderLoaded(e) {
      let reader = e.target;
      this.base64textString = reader.result;
      // console.log("base64textString", this.base64textString)
      var base64result = this.base64textString.substr(this.base64textString.indexOf(',') + 1);
      console.log("base64result", base64result)
      // this.beatService.multipleFileUpload(this.fileName, base64result, this.fileExt, this.userId)
      //    .takeUntil(this.ngUnsubscribe)
      //    .subscribe((data: Message)=>{
      //      this.resp = data;
      //      this.fileArray.push(this.resp);
      //      this.showRespTable = true;
      //      console.log("response", this.fileArray)
      //      for(var i=0; i < this.fileArray.length; i++) {
      //         this.filesId = this.fileArray[i].fileId;
      //      }
      //     this.fileIdArray.push(this.filesId);
      //     // console.log("id array", this.fileIdArray);
      //     this.fileIDs = {
      //       fArray : this.fileIdArray.toString()
      //     }
      //     // console.log("fArray", this.fileIDs)

      // })
    }
    // console.log("res", res.result)
  //   this.fileName = event.target.file.name;
  //               this.fileExt = event.target.file.name.split('.').pop();
  //  console.log("type", this.fileName)
// }
  // onSelectFile(event) {
  //   var files = event.target.files[0];
  //   if (event.target.files && event.target.files[0]) {
  //       var filesAmount = event.target.files.length;
  //       for (let i = 0; i < filesAmount; i++) {
  //               var reader = new FileReader();
  //               reader.onload =this._handleReaderLoaded.bind(this);
  //               reader.readAsBinaryString(files);
  //               var encoded = this.urls[0];
  //               this.fileName = event.target.files[i].name;
  //               this.fileExt = event.target.files[i].name.split('.').pop();
  //               // console.log("type", this.fileExt)
          
  //       }
  //   }
  // }
  

  //  _handleReaderLoaded(readerEvt) {
  //     var binaryString = readerEvt.target.result;
  //     this.base64textString= btoa(binaryString);
  //   console.log("this.base64textString", this.base64textString)
  //     //    this.beatService.multipleFileUpload(this.fileName,this.base64textString, this.fileExt, this.userId)
  //     //    .takeUntil(this.ngUnsubscribe)
  //     //    .subscribe((data: Message)=>{
  //     //      this.resp = data;
  //     //      this.fileArray.push(this.resp);
  //     //      this.showRespTable = true;
  //     //     //  console.log("response", this.fileArray)
  //     //      for(var i=0; i < this.fileArray.length; i++) {
  //     //         this.filesId = this.fileArray[i].fileId;
  //     //      }
  //     //     this.fileIdArray.push(this.filesId);
  //     //     // console.log("id array", this.fileIdArray);
  //     //     this.fileIDs = {
  //     //       fArray : this.fileIdArray.toString()
  //     //     }
  //     //     // console.log("fArray", this.fileIDs)

  //     // })
  //   }


  // save issue 
  saveIssue() {
    let issueId = {
      issueMstrId: this.issueMstrId
    }
    if( this.addIssueForm.invalid) {
      return
    }
    else if (this.fileIDs) {
      // console.log("else if condition")
      this.loading = true;
      this.beatService.saveIssue(Object.assign(issueId, this.fileIDs, this.addIssueForm.value))
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          console.log("data", data)
          if(data.error == "true"){
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'IssueNotAdded'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          } else {
            this.loading = false;
            // this.dialogRef.close()
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'IssueAdded',
              ticketId: data.id
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig);
          this.router.navigate(['/issue-tracking'])
          }
        })
    } 
    else {
      // console.log("else condition")
      this.loading = true;
      this.beatService.saveIssue(Object.assign(issueId,this.addIssueForm.value))
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          console.log("data", data)
          if(data.error == "true"){
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'IssueNotAdded'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          } else {
            this.loading = false;
            // this.dialogRef.close()
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'IssueAdded',
              ticketId: data.id
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig);
          this.router.navigate(['/issue-tracking'])
          }
        })
    }


  }

   delete(id) {
    // DeleteUploadedFile
    console.log("id", id)
    this.beatService.DeleteUploadedFile(id, this.userId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          console.log("data", data)
          if(data.error == "true"){
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'notDeleted'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
          else {
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'Deleted'
            };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
     })
  }
  reset() {
    this.addIssueForm.reset();
  }
  
  resData: any;
  apiEndPoint: any = 'http://123.252.246.214:8080/PrimesystrackAdminFileupload/rest/files/uploadFile'
   // multipart entity code
  fileChange(event) {
    this.beatService.multipartFileUpload(this.userId).subscribe((data: Message)=>{
      console.log("data", data)
 })









    // let fileList: FileList = event.target.files;
    // if(fileList.length > 0) {
    //     let file: File = fileList[0];
    //     let formData:FormData = new FormData();
    //     formData.append('uploadFile', file, file.name);
    //     let headers = new Headers();
    //     /** In Angular 5, including the header Content-Type can invalidate your request */
    //     headers.append('Content-Type', 'multipart/form-data');
    //     headers.append('Accept', 'application/json');
    //     let options = new HttpHeaders({ headers: headers });
    //     this.http.post(`${this.apiEndPoint}`, formData, options)
    //         .map(res => res)
    //         // .catch(error => Observable.throw(error))
    //         .subscribe(
    //             data => console.log('success',res),
    //             error => console.log(error)
    //         )
    // }












    // const fileBrowser = this.myInputVariable.nativeElement;
    // if (fileBrowser.files) {
    //   if (fileBrowser.files[0].size < 10000) {    // 16000
    //     this.sharedFunctionsService.showWarningToast('File is too small, needs to be at least 10KB');
    //   } else {
    //     const formData: FormData = new FormData();
    //     formData.append('file', fileBrowser.files[0]);
    //     this._uploadIcoFile(this.icoId, this.type, formData);
    //   }
    // }



    // var fileList: FileList = event.target.files;
    // if(fileList.length > 0) {

    //     var files: any = fileList[0];
    //     console.log("file", files)
    //     var fileName: any = files.name;
    //     var formData:any = new FormData();
    //     // formData.append('uploadFile', files, fileName);
      
    //     const file = new FormData();
    //     file.append('file', files);
    //     file.append('fileName', fileName);

    //     // const headers = new Headers({'enctype': 'multipart/form-data'});
    //     // headers.append('Accept', 'application/json');
    //     // const options = new HttpHeaders(headers);
        // let options = {
        //     // headerss: new HttpHeaders().set('enctype', 'multipart/form-data'),
            
        //     // headers: new HttpHeaders().set('Content-Type', 'multipart/form-data'),
        //     // headerss: new HttpHeaders().set('Access-Control-Allow-Origin', '*'),
        //     header: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        //   }
          // var req =  this.http
          // .get('http://123.252.246.214:8080/PrimesystrackAdminFileupload/rest/files/GetCheckAPI',options
          // ).subscribe((data: any) => {
          //   this.resData = data;
          //   console.log(this.resData);
          // });
          // return req;
    //         console.log("ghgh",req)

    //  let options = {
    //   headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    // };
    // var res = this.http.get('http://123.252.246.214:8080/PrimesystrackAdminFileupload/rest/files/GetCheckAPI', options).subscribe((data: any) => {
    //     this.resData = data;
    //     console.log(this.resData);
    //   }); 
    // console.log("res", res)
    // return res;










    //     this.beatService.multipartFileUpload(formData).subscribe((data: any) => {
    //       this.resData = data;
    //       console.log(this.resData);
    //     });

        // this.beatService.multipartFileUpload(formData)
        // .takeUntil(this.ngUnsubscribe)
        // .subscribe((data: Message)=>{
        // })
        // let headers = new Headers();
        /** In Angular 5, including the header Content-Type can invalidate your request */
        // let options = {
        //   headers: new HttpHeaders().set('Content-Type', 'multipart/form-data'),
        //   // headerss: new HttpHeaders().set('Content-Type', 'application/json'),
        // }

      //  let headers={
      //     headers: new HttpHeaders({
      //         'Content-Type': 'multipart/form-data'
      //     })
      // }
      
//         let params = new HttpParams()
//         .set('file', formData)
//        var req = this.http.post('http://123.252.246.214:8080/PrimesystrackAdminFileupload/rest/files/uploadFile', params, options).subscribe(response => {
//       console.log(response);
// });
// console.log("rea", req)
    }
}

