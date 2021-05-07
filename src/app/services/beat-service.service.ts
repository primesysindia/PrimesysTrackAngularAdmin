import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { Observable, interval, throwError, of } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class BeatServiceService {
  localApi : any = 'http://123.252.246.214:8080/TrackingAppDB/TrackingAPP/'
  constructor(private http: HttpClient, private logServ: LoginService) {
    
   }
// get keyman existing beat api
  getKeymanBeat(pId, stdId, beatId) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('parentId', pId)
    .set('studentId', stdId)
    .set('beatId', '0')
    .set('userLoginId', userLoginId)

    var res = this.http.post(this.logServ.apiUrl+'AdminDashboardServiceApi/GetKeymanExistingBeat', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // get keyman beat by ID api
  getKeymanBeatById(pId, stdId, beatId) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('pId', pId)
    .set('beatId', beatId)
    .set('stdId', stdId)
    .set('userLoginId', userLoginId)

    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetKeymanExistingBeat', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // get section name api
  getSectionName(pId) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('parentId', pId)

    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetSectionNames', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // save keyman beat api
  SaveKeymanBeat(data: any) {
    // console.log("data", data)
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    let studentId = JSON.parse(localStorage.getItem('StudentID'))
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('kmStart', data.kmStart)
    .set('kmEnd', data.kmEnd)
    .set('sectionName', data.sectionName)
    .set('kmStartLat', data.kmStartLat)
    .set('kmStartLang', data.kmStartLang)
    .set('kmEndLat', data.kmEndLat)
    .set('kmEndLang', data.kmEndLang)
    .set('parentId', parentId)
    .set('studentId', studentId)
    .set('userLoginId', userLoginId)
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/SaveKeymanBeat', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // update keyman beat api
  UpdateKeymanBeat(data: any) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    let studentId = JSON.parse(localStorage.getItem('StudentID'))
    let beatId = JSON.parse(localStorage.getItem('beatId'))
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;
    let params = new HttpParams()
    .set('kmStart', data.kmStart)
    .set('kmEnd', data.kmEnd)
    .set('sectionName', data.sectionName)
    .set('kmStartLat', data.kmStartLat)
    .set('kmStartLang', data.kmStartLang)
    .set('kmEndLat', data.kmEndLat)
    .set('kmEndLang', data.kmEndLang)
    .set('parentId', parentId)
    .set('beatId', beatId)
    .set('studentId', studentId)
    .set('userLoginId', userLoginId)
    .set('isApprove', 'false')

    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/UpdateKeymanBeat', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // approve keyman beat api
  ApproveKeymanBeat(data: any) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    let studentId = JSON.parse(localStorage.getItem('StudentID'))
    let beatId = JSON.parse(localStorage.getItem('beatId'))
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let params = new HttpParams()
    .set('kmStart', data.KmStart)
    .set('kmEnd', data.KmEnd)
    .set('sectionName', data.SectionName)
    .set('kmStartLat', data.Start_Lat)
    .set('kmStartLang', data.Start_Lon)
    .set('kmEndLat', data.End_Lat)
    .set('kmEndLang', data.End_Lon)
    .set('parentId', parentId)
    .set('beatId', beatId)
    .set('studentId', studentId)
    .set('userLoginId', userLoginId)
    .set('isApprove', 'true')

    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/UpdateKeymanBeat', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }
 
  // save master trip api
  SavePatrolmanMasterBeat(data: any) {
    // console.log("data", data)
    let studentId = JSON.parse(localStorage.getItem('StudentID'))
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('parentId', data.pId)
    .set('tripName', data.tripName)
    .set('tripStartTime', data.tripStartTime)
    .set('tripEndTime', data.tripEndTime)
    .set('userLoginId', userLoginId)
  // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/SaveRailwayPatrolManTripTimeMaster ', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }
  
  // save patrolman beat api
  SavePetrolmanBeat(data: any) {
   var daata = JSON.parse(data);

    let params = new HttpParams()
    .set('patrolmanBeatData',JSON.stringify(daata))
     console.log("data", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/SavePatrolManBeat', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // get patrolman existing beat api
  getPatrolmanExistingBeat(pId, stdId, beatId) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

     let params = new HttpParams()
    .set('parentId', pId)
    .set('studentId', stdId)
    .set('beatId', '0')
    .set('userLoginId', userLoginId)

    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetPatrolManExistingBeat ', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // get railway trip master api
  GetRailwayPetrolmanTripsMaster(pId) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('parentId', pId)
    // console.log("paarams", params)

    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetRailwayPetrolmanTripsMaster', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // get patrolman beat by id api
  getPatrolmanExistingBeatById(pId, stdId, beatId) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('parentId', pId)
    .set('studentId', stdId)
    .set('beatId', beatId)
    .set('userLoginId', userLoginId)

    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetPatrolManExistingBeat ', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // update parolman beat
  UpdatePatrolManBeat (data: any) {
  //  console.log("data", data);
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    // let studentId = JSON.parse(localStorage.getItem('StudentID'))
    let beatId = JSON.parse(localStorage.getItem('beatId'))
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('parentId', parentId)
    .set('studentId', data.stdId)
    .set('beatId', beatId)
    .set('kmStart', data.kmStart)
    .set('kmEnd', data.kmEnd)
    .set('sectionName', data.sectionName)
    .set('seasonId', data.seasonId)
    .set('totalKmCover', data.totalKmCover)
    .set('fk_TripMasterId', data.fk_TripMasterId)
    .set('userLoginId', userLoginId)
    .set('isApprove','false')
  
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/UpdatePatrolManBeat ', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

//  approve patrolman beat api
  ApprovePatrolManBeat (data: any) {
   
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    let studentId = JSON.parse(localStorage.getItem('StudentID'))
    let beatId = JSON.parse(localStorage.getItem('beatId'))
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('parentId', parentId)
    .set('studentId', studentId)
    .set('beatId', beatId)
    .set('kmStart', data.kmStart)
    .set('kmEnd', data.kmEnd)
    .set('sectionName', data.sectionName)
    .set('totalKmCover', data.totalKmCover)
    .set('fk_TripMasterId', data.fk_TripMasterId)
    .set('userLoginId', userLoginId)
    .set('isApprove','true')
  
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/UpdatePatrolManBeat ', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // get railway department hierarchy api
  GetRailwayDepHierarchy (pId) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('parentId', pId)
    .set('hirachyParentId', '0')
    .set('userLoginId', userLoginId)
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetRailwayDeptHierarchy', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // get railway department hierarchy by id
  GetRailwayDepHierarchyById (pId, hId) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('parentId', pId)
    .set('hierarchyId', hId)
    .set('userLoginId', userLoginId)
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetRailwayDeptHierarchy', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // get department api
  GetDepartment() {
    return this.http.get(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetDepartments')
  }
 
  // save railway department hierachy api
  saveHierarchy(data: any) {
    // console.log("data", data)
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    let studentId = JSON.parse(localStorage.getItem('StudentID'))
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let params = new HttpParams()
    .set('parentId', parentId)
    .set('userLoginId', userLoginId)
    .set('deptName', data.deptName)
    .set('emailId', data.emailId)
    .set('mobileNo', data.mobileNo)
    .set('deptId', data.deptId)
    .set('hirachyParentId', '0')
    // .set('deptParentId', data.hirachyParentId)
    .set('deptParentId', data.deptParentId)
    .set('studentsNo', data.studentsList)

    // console.log("params", params)

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/SaveRailwayDeptHierarchy', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // update raiway department hierachy api
  updateHierarchy(data) {

    // console.log("data", data)
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    let studentId = JSON.parse(localStorage.getItem('StudentID'))
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var hirachyID = JSON.parse(localStorage.getItem('hierachyId'));
    var userLoginId = userInfo.usrId;

    let params = new HttpParams()
    .set('parentId',parentId)
    .set('userLoginId', userLoginId)
    .set('deptId', data.deptId)
    .set('deptName', data.deptName)
    .set('emailId', data.emailId)
    .set('mobileNo', data.mobileNo)
    .set('deptParentId', data.deptParentId)
    .set('hierarchyId', hirachyID)
    .set('studentsNo', data.studentsList)
    // .set('hirachyParentId', '0')
    .set('isApprove', 'false')
    // console.log("params", params)

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/UpdateRailwayDeptHierarchy', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

// approve raiway department hierachy api
  approveHierarchy(data) {
    // console.log("data", data)
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    let studentId = JSON.parse(localStorage.getItem('StudentID'))
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

   let params = new HttpParams()
    .set('parentId',parentId)
    .set('userLoginId', userLoginId)
    .set('deptId', data.deptId)
    .set('deptName', data.deptName)
    .set('emailId', data.emailId)
    .set('mobileNo', data.mobileNo)
    .set('deptParentId', data.deptParentId)
    .set('hierarchyId', data.hirachyId)
    .set('studentsNo', data.studentsNo)
    .set('isApprove', 'true')
    // console.log("params", params)

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/UpdateRailwayDeptHierarchy', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // get commands for devices api
  getDevicesCommand() {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetDeviceCommand', userLoginId, options)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // get issue list api
  GetIssueList () {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('userLoginId', userLoginId)
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetIssueMasetrList', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // update student name api
  updateStudentName(data: any) {
    // console.log("data", data)
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
  
     let params = new HttpParams()
     .set('ParentId', parentId)
     .set('Name', data.name)
     .set('IdNo', data.id)
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl +'UserServiceAPI/UpdateNameOfDevices', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // get all issue history details api
  getAllIssueHistory() {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;
    var studentId = JSON.parse(localStorage.getItem('StudentID'))
    // console.log("stdid", studentId)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('studentId', '0')
    .set('issueId', '0')
    .set('userLoginId', userLoginId)
    .set('startTime', '0')
    .set('endTime','0')
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetIssueDetails', params, options)
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // get issue by student id
  getSingleIssue(std) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;
    var studentId = JSON.parse(localStorage.getItem('StudentID'))
    // console.log("stdid", studentId)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('studentId', std)
    .set('issueId', '0')
    .set('userLoginId', userLoginId)
    .set('startTime', '0')
    .set('endTime','0')
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetIssueDetails', params, options)
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

// get issue history date wise
  getIssueDetailsWithDateRange(data: any) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;
    var studentId = JSON.parse(localStorage.getItem('StudentID'))
    // console.log("stdid", studentId)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('studentId', '0')
    .set('issueId', '0')
    .set('userLoginId', userLoginId)
    .set('startTime', data.sTime)
    .set('endTime', data.eTime)
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetIssueDetails', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // get issue details by id api
  getIssueDetailsById(stdId, issueId) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;
    // var studentId = JSON.parse(localStorage.getItem('StudentID'))
    // console.log("stdid", studentId)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('studentId', stdId)
    .set('issueId', issueId)
    .set('userLoginId', userLoginId)
    console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetIssueDetails', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  getIssueDetailById(issueId) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;
    // var studentId = JSON.parse(localStorage.getItem('StudentID'))
    // console.log("stdid", studentId)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('studentId', '0')
    .set('issueId', issueId)
    .set('userLoginId', userLoginId)
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetIssueDetails', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // save issue api
  saveIssue(data: any) {
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    let devInfo = JSON.parse(localStorage.getItem('DeviceInfo'))
    let studentId = devInfo.student_id;
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let params = new HttpParams()
    .set('parentId', parentId)
    .set('userLoginId', userLoginId)
    .set('studentId', studentId)
    .set('isseMasterId', data.issueMstrId)
    .set('contactPerson', data.caller_name)
    .set('contactPersonMobNo', data.contact)
    .set('issueStatus', data.status)
    .set('priority', data.priority)
    .set('issueComment', data.description)
    .set('isBatteryOn', data.isBatteryOn)
    .set('isDeviceOn', data.isDeviceOn)
    .set('isImeiSIMCorrect', data.IsImeiSIMCorrect)
    .set('isGSMOn', data.IsGSMOn)
    .set('isDeviceButtonOn', data.isDeviceButtonOn)
    .set('isGpsOn', data.isGpsOn)
    .set('fileList', data.fArray)
    // console.log("params", params)

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/SaveDeviceIssue', params, options)
    
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // update issue api
  updateIssue(data: any) {
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    let studentId = JSON.parse(localStorage.getItem('StudentID'))
    let issueId = JSON.parse(localStorage.getItem('issueId'))
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let params = new HttpParams()
    .set('issueStatus', data.status)
    .set('priority', data.priority)
    .set('issueId', issueId)
    .set('updatedBy', userLoginId)
    .set('issueComment', data.descrip)
    .set('isBatteryOn', data.isBatteryOnS)
    .set('isDeviceOn', data.isDeviceOnS)
    .set('isImeiSIMCorrect', data.isImeiSIMCorrectS)
    .set('isGSMOn', data.isGSMOnS)
    .set('isDeviceButtonOn', data.isDeviceButtonOnS)
    .set('isGpsOn', data.isGpsOnS)
    .set('contactNo', data.contact)

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/UpdateDeviceIssue', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // update device exchange api
  updateDeviceExchange(data: any) {
    // console.log("data", data)
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let params = new HttpParams()
    .set('userLoginId', userLoginId)
    .set('parentId', parentId)
    .set('studentId1', data.devi1)
    .set('studentId2', data.devi2)
    .set('isDeviceSimExchange', data.checked)
    // console.log("params", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/UpdateDeviceExchange', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // update new device name api
  updateNewDeviceName(data: any) {
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    let params = new HttpParams()
    .set('parentId', parentId)
    .set('studentId', data.device1)
    .set('imeiNo', data.imei_no)
    .set('firstName', data.name)
    .set('simNo', data.simNo)
    // console.log("params", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/UpdateNewDeviceIMEI ', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }
 
  // get list of exchanged devices api
  GetAllDeviceExchange (pId) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId; 
    var parentId = JSON.parse(localStorage.getItem('ParentId'))
    // console.log("stdid", studentId)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
     .set('parentId', pId)
     .set('userLoginId', userLoginId)
     var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetDeviceExchange ', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // exchange beat nad device update api
  ExchangeDeviceAndBeatUpdate (data: any) {
    // console.log("data", data)
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let params = new HttpParams()
    .set('userLoginId', userLoginId)
    .set('parentId', parentId)
    .set('studentId1', data.devi1)
    .set('studentId2', data.devi2)
    console.log("params", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/UpdateWholeDeviceExchange ', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // get device info with issue api
  GetDeviceInfoAndIssue (std_id, imei_no) {
    let params = new HttpParams()
    .set('studentId', std_id)
    .set('imeiNo', imei_no)
    // console.log("params", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetDeviceInfo', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // get devices list
  GetDevicesInfo (pId) {
    let params = new HttpParams()
    .set('parentId', pId)
    
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'LoginServiceAPI/getTrackInfo', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // get command history sent to devices
  GetDevicesCommandHistory (data) {
    let params = new HttpParams()
    .set('deviceId', '0')
    .set('startTime', data.sTime)
    .set('endTime', data.eTime)
    // console.log("params", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetDeviceCommandHistory', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // get command history date wise
  GetDevCmdHistoryDateWise (data) {
    // console.log("data", data)
    let params = new HttpParams()
    .set('deviceId', '0')
    .set('startTime', data.sTime)
    .set('endTime', data.eTime)
    
    console.log("parmas", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetDeviceCommandHistory', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  GetTodaysDevCmdHistory (data) {
    // console.log("data", data)
    let params = new HttpParams()
    .set('deviceId', '0')
    .set('startTime', data.sTime)
    .set('endTime', data.eTime)
    
    // console.log("parmas", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetDeviceCommandHistory', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // get rdps data from api
  GetRDPSdata (lat, lan) {
    var pId = localStorage.getItem('ParentId')
    let params = new HttpParams()
    .set('parentId', pId)
    .set('lat', lat)
    .set('lan', lan)
    
    // console.log("parmas", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetRDPSInfo', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // get sample mail format api
  GetSampleMailFormat () {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.get(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetIssueMail', options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // send mail api
   generateMail(data) {
    let params = new HttpParams()
    .set('toMail', data.sendTo)
    .set('subject', data.subject)
    .set('message', data.compose)
    .set('ccMail', data.cc)

    // console.log("parmas", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GenerateSupportMail ', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

   // get battery on/off status api
   GetBatteryStatus (imei, sTime, endTime) {
    let params = new HttpParams()
    .set('imeiNo', imei)
    .set('StartDateTime', sTime)
    .set('EndDateTime', endTime)
    //  console.log("params", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    // var res = this.http.get(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetIssueMail', options) 
     var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetBatteryDetailPowerOnOffInfo', params,options)
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

// get payment type api
  GetDevicePaymentType(parID) {
    let params = new HttpParams()
    .set('parentId', parID)
    //  console.log("params", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    // var res = this.http.get(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetIssueMail', options) 
     var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetDevicePaymentType ', params,options)
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // post multiple devices payment
  MultipleDevicePayment(data) {
    // console.log("data", data)
    let params = new HttpParams()
    .set('studentId', data.studentsList)
    .set('parentId', data.pId)  
    .set('paymentTypeId', data.paymentType)
    .set('currentStatus', data.currentStatus)
    //  console.log("params", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/MultipleDevicePayment', params,options)
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // delete keyman beat
  DeleteKeymanBeat(beat, usrId) {
    // console.log("data", data)
    let params = new HttpParams()
    .set('beatId', beat)
    .set('userLoginId', usrId)  
    //  console.log("params", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/DeleteKeymanBeat', params,options)
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // delete patrolman beat
  DeletePatrolmanBeat(beat, usrId) {
    // console.log("data", data)
    let params = new HttpParams()
    .set('beatId', beat)
    .set('userLoginId', usrId)  
    //  console.log("params", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    
     var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/DeletePatrolManBeat', params,options)
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  multipleFileUpload(fileName, fileEncoded, fileExt, usrId) {
    // console.log("fileencode", fileEncoded);
    let params = new HttpParams()
    .set('fileName', fileName)
    .set('userId', usrId)  
    .set('file', fileEncoded)  
    .set('fileExtension', fileExt)  
    //  console.log("params", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    
     var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/UploadIssueFile', params,options)
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  DeleteUploadedFile(id, usrId) {
    // console.log("data", data)
    let params = new HttpParams()
    .set('fileId', id)
    .set('userLoginId', usrId)  
    //  console.log("params", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    
     var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/DeleteFileUpload', params,options)
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  getAllDevicesInfo() {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.get(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetDeviceGatheringInfo',options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  getAllDevicesWithConnectedStatus(pId) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }; 
    let params = new HttpParams()
    .set('parentId', pId) 
    //  console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/getAllStudentsWithConnectedStatus', params, options) 
    // console.log("res", res)
    return res.pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // get payment details api of devices
  getPaymentDetails(parentId){
    let options = { 
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }
    var pId = parentId.toString();
    let params = new HttpParams()
    .set('ParentId', parentId);
    // console.log("params", params)
    return this.http.post(this.logServ.apiUrl+'AdminDashboardServiceApi/GetDevicePaymentInfoForAdmin', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
            mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

   // get all customer issue details api
   getAllCustomerIssue() {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;
    var studentId = JSON.parse(localStorage.getItem('StudentID'))
    // console.log("stdid", studentId)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     let params = new HttpParams()
    .set('studentId', '0')
    .set('issueId', '0')
    .set('userLoginId', userLoginId)
    .set('startTime', '0')
    .set('endTime','0')
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetClientEnteredIssueDetailsForAdmin', params, options)
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // multipart file entity code
  multipartFileUpload(usr) {
    let headers = new Headers();
    /** In Angular 5, including the header Content-Type can invalidate your request */
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    } 
    let params = new HttpParams()
    return this.http.get('http://123.252.246.214:8080/PrimesystrackAdminFileupload/rest/files/GetCheckAPI', options)
  }


  getKeymanExistingBeatByParent(parId) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     let params = new HttpParams()
    .set('parentId', parId)
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetKeymanExistingBeatToApproveByParent', params, options)
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // approve keymen beat for user-portal
  ApproveKeyManBeatForUser (beatId, existingBeat) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('beatId', beatId)
    .set('userLoginId', userLoginId)
    .set('ExistingBeatId', existingBeat)  
  
    // console.log("params", params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/UpdateRailwayKeymanBeatPathCopyApprove', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // device unregister api
  DeviceUnRegisterAPI (imeiNo) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('imeiNo', imeiNo)
    .set('userLoginId', userLoginId)
  
    console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/DeviceUnRegisterAPI', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // device remove api
  DeviceRemove (imeiNo) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('ImeiNo', imeiNo)
    .set('userLoginId', userLoginId)
  
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/RemoveDeviceAPI', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  DeviceRegisterAPI (imeiNo) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('imeiNo', imeiNo)
    .set('userLoginId', userLoginId)
  
    // console.log("params register", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/DeviceRegisterAPI', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // get info related device  
  GetAddDeviceDropDownInfo () {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('userLoginId', userLoginId)
  
    console.log("params", params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/GetAddDeviceDropDownInfo', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  //save single device info
  addSingleDevice (data) {
    console.log(data)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('StudentID', '0')
    .set('ParentId', data.parentId)
    .set('FirstName',data.FirstName)
    .set('LastName', data.LastName)
    .set('Gender', 'M')
    .set('DeviceID',data.DeviceID)
    .set('Type', data.Type)
    .set('DeviceType', data.DeviceType)
    .set('DeviceSimNumber', data.DeviceSimNumber)
    .set('ActivationDate',data.actDate)
    .set('PlanTypeID', data.PlanTypeID)
    .set('PaymentMode',data.PaymentMode )
    .set('CreditName', data.TransactionID)
    .set('PaymentDate', data.payDate)
    .set('TransactionID',  data.TransactionID)
    .set('PayAmount',  data.PayAmount)
    .set('DeviceSimIMEINumber', data.simImeiNo)
  
    console.log("params", params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/AddNewDevice', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }
 

  addMultipleDevice (data) {
    console.log(data)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('StudentID', '0')
    .set('ParentId', data.parentId)
    .set('Gender', 'M')
    // .set('DeviceID',data.DeviceID)
    .set('Type', data.Type)
    .set('DeviceType', data.DeviceType)
    // .set('DeviceSimNumber', data.DeviceSimNumber)
    .set('ActivationDate',data.actDate)
    .set('PlanTypeID', data.PlanTypeID)
    .set('PaymentMode',data.PaymentMode)
    .set('CreditName', data.TransactionID)
    .set('PaymentDate', data.payDate)
    .set('TransactionID',  data.TransactionID)
    .set('PayAmount',  data.PayAmount)
    .set('BulkData', data.bulkData)
  
    console.log("params", params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/AddBulkDevices', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // get patrolmen beat list to approve
  getPatrolmenExistingBeatByParent(parId) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     let params = new HttpParams()
    .set('parentId', parId)
    .set('seasonId', '1')
    // console.log("params", params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/GetPatrolmanExistingBeatToApproveByParent', params, options)
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

   // approve patrolmen beat for user-portal
  ApprovePatrolmenBeatForUser (beatId) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('beatId', beatId)
    .set('userLoginId', userLoginId)
    // .set('ExistingBeatId', existingBeat)  
  
    // console.log("params", params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/UpdateRailwayPatrolmanCopyApprove', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  // save keymen beats in bulk
  saveKeymenBeatsInBulk (data: any) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     let params = new HttpParams()
    .set('KeymanBeatData',JSON.stringify(data))
    // console.log(params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/SaveKeymanBeatInBulk', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

// get url for report generation
  getReportGenerateUrl (pId, day) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('parentId', pId)
    .set('day', day)
    // console.log(params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/GetReportAdminAPI', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  sendReportUrl(url) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    var res = this.http.post(url, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(1200000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // save inspection form
  saveInspectionForm (data) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let params = new HttpParams()
    .set('inspectionId', '0')
    .set('studentId', data.deviceNo)
    .set('issueTitle', data.issueTitle)
    .set('issueDescription', data.issueDesc)
    .set('finalTestingReport', data.finalReport)
    .set('inspectedBy', data.inspectedBy)
    .set('contactPerson', data.contactPerson)
    .set('inspectionDate', data.InspectionDate)
    .set('userLoginId', userLoginId)
    .set('isReusable', '0')

    console.log(params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/SaveDeviceInspectionReportAPI', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  // get patrolmen beat list to approve
  getInspectionData() {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;
    
     let params = new HttpParams()
    .set('userLoginId','0')
    // console.log("params", params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/GetDeviceInspectionReportAPI', params, options)
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

   // save inspection form
   editInspectionForm (data) {
    console.log("data", data)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let params = new HttpParams()
    .set('inspectionId', data.inspectionId)
    .set('studentId', data.deviceNo)
    .set('issueTitle', data.issueTitle)
    .set('issueDescription', data.issueDesc)
    .set('finalTestingReport', data.finalReport)
    .set('inspectedBy', data.inspectedBy)
    .set('contactPerson', data.contactPerson)
    .set('inspectionDate', data.InspectionDate)
    .set('userLoginId', userLoginId)
    .set('isReusable', data.isReusable)

    console.log(params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/SaveDeviceInspectionReportAPI', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

}


