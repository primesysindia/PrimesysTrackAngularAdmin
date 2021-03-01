import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, interval, throwError } from 'rxjs';
import { retryWhen, map, mergeMap } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient, private logServ: LoginService) { }

  getTripReport(imei_no, startDt, endDt){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('DeviceImieNo', imei_no)
    .set('StartDateTime', startDt)
    .set('EndDateTime', endDt)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GetDirectTripReport', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }//end getTripReport()

  getDeviceCurrStatReport(currentDt,pastMin,parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    //console.log(currentDt+"\n"+pastMin+"\n"+parentId)

    let params = new HttpParams()
    .set('StartDateTime', currentDt)
    .set('pastMin', pastMin)
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GenerateGPSHolder10MinData', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  getDeviceOnReport(repoDate,parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('StartDateTime', repoDate)
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GenerateGPSDeviceOnData', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  getDeviceOffReport(repoDate,parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('StartDateTime', repoDate)
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GenerateGPSDeviceOFFData', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  getMonitorSOSReport(repoDate,parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('StartDateTime', repoDate)
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GetSosData', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  getDeviceONOffStatus(repoDate,parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('StartDateTime', repoDate)
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/DeviceONOffStatus', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  getBatteryStatusReport(repoDate,parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('StartDateTime', repoDate)
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GetBatteryData', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  getTodayDeviceStatus(parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }

    let params = new HttpParams()
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/TodayDeviceStatus', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  getExceptionReport(repoDate,parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('Timestamp', repoDate)
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/getExceptionReportFile', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  getDateWiseExceptionReport(parentId, reportType, startDt, endDt){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('ParentId', parentId)
    .set('reportType', reportType)
    .set('StartTimestamp', startDt)
    .set('EndTimestamp', endDt)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/getDeviceRangeExceptionReport', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  getAddress(lat, lng){
    console.log("api callled")
   return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key="+environment.googleApiKey)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }
  
}
