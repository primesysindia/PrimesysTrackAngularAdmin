import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subject } from 'rxjs/Rx';
import { map, retryWhen, mergeMap } from 'rxjs/operators';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { interval, throwError, of } from 'rxjs';
import { User } from '../core/user.model';
import 'rxjs/add/operator/timeout';
import { LoginService } from './login.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiveLocationService {

  messages: Subject<MessageEvent>;
  currUser: User;
  
  //calls wsService connect method
  constructor(private wsService: WebsocketService,
              private http: HttpClient,
              private logServ: LoginService
            ) {}

  initSocket(webSocketUrl){
    this.messages = <Subject<MessageEvent>>this.wsService
    .connect(webSocketUrl)
    .pipe(map((response: MessageEvent): MessageEvent => {
      var res = response;
      // console.log("responsedd", res)
      return res;
    }))
  }
  
  // interface for sending messages back to our websocket server
  sendMsg(input) {
    this.messages.next(input);
    console.log("input", input)
  }

  getSnapToRoad(loc1,loc2){
    var pathValues = [];
    pathValues.push(loc1.toUrlValue())
    pathValues.push(loc2.toUrlValue())
    return this.http.get("https://roads.googleapis.com/v1/snapToRoads?path="+pathValues.join('|')+"&interpolate=true&key="+environment.googleApiKey)
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

  getFeatureAddress(){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let user: User = JSON.parse(localStorage.getItem('currentUserInfo'))
    let userId = user.usrId.toString()
    
    let params = new HttpParams()
    .set('ParentId', userId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GetFeatureAddress', params, options)
    .timeout(120000)
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
