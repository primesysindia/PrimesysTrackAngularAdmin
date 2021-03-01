import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { interval, throwError, of } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class GetHistoryService {
  localApi : any = 'http://123.252.246.214:8080/TrackingAppDB/TrackingAPP/'
  constructor(private http: HttpClient,
              private logServ: LoginService
              ) { }

  getTrackHistory(startDt, endDt, imei_no){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('Imei_no', imei_no)
    .set('StartDateTime', startDt)
    .set('EndDateTime', endDt)
      // console.log("params", params)
    // post these details to API, server will return tracking history information
    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GetHistoryInfo', params, options)
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
