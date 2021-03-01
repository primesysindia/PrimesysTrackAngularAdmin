import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { User } from '../core/user.model';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { interval, throwError, of } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient, private logServ: LoginService) { }

  getPaymentDetails(){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }
    let user: User = JSON.parse(localStorage.getItem('currentUserInfo'))
    let webUserId = user.webUserID.toString();

    let params = new HttpParams()
    .set('userId',webUserId);
    return this.http.post(this.logServ.apiUrl+'LoginServiceAPI/getDevicePaymentInfoForUsers', params, options)
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
