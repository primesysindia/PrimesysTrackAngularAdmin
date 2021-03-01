import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { interval, throwError, of } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class TaskManagementService {

  constructor(private logServ: LoginService, private http: HttpClient) {}

  addNewEmployee(data: any){
    let currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }
    let params = new HttpParams()
    .set('empName', data.empName)
    .set('mobileNo', data.mobileNo)
    .set('emailId', data.email)
    .set('address', data.address)
    .set('gender', data.gender)
    .set('parentId', currUser.usrId)
    .set('studentId', data.vehicleName.student_id)
    .set('flag', '0')
      console.log("params", params)
    //call service to add new Driver employee
    return this.http.post(this.logServ.apiUrl+'TaskManagementService/AddNewEmployee', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
         mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  fetchEmployeeDetails(){
    let currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }
    let params = new HttpParams()
    .set('UserId', currUser.usrId)

    //call service to get driver employee details
    return this.http.post(this.logServ.apiUrl+'TaskManagementService/GetEmployeeDetails', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
         mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }
}
