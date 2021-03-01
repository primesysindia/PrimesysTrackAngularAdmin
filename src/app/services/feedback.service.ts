import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { interval, throwError, of } from 'rxjs';
import { User } from '../core/user.model';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(public http: HttpClient,private logServ: LoginService) { }

  sendFeedback(rating,usage,aspect,compare,likeProduct,suggestion){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let user: User = JSON.parse(localStorage.getItem('currentUserInfo'))

    let params = new HttpParams()
    .set('satisfy', rating)
    .set('usage', usage)
    .set('aspect', aspect)
    .set('compare', compare)
    .set('like', likeProduct)
    .set('suggestion', suggestion)
    .set('emailId', user.emailID)

    return this.http.post(this.logServ.apiUrl+'LoginServiceAPI/SendFeedback', params, options) 
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
