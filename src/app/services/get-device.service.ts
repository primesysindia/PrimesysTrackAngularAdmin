import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { interval, throwError, of } from 'rxjs';
import { LoginService } from './login.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetDeviceService {

  constructor(private http: HttpClient, private logServ: LoginService) { }

  getAllDeviceList(userId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('parentId', userId)

    return this.http.post(this.logServ.apiUrl+'LoginServiceAPI/getTrackInfo', params, options) 
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )          
  }

  getAllDeviceLocation(userId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('ParentId', userId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GetOptimizedAllDeviceLocation', params, options)
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
