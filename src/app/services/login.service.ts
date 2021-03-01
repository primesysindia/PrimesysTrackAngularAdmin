import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../core/user.model';
import { Observable, interval, throwError, of, fromEvent, merge, Subject } from 'rxjs';
import { retryWhen, mergeMap, mapTo } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private ngUnsubscribe: Subject<any> = new Subject();
  private loggedInStatus = JSON.parse(localStorage.getItem('ChkloggedInStatus'));
  redirectUrl: string;
  online$: Observable<boolean>;
  userInfo: User;
  urlApi: string;
  serverUrl: string;
  ApiProject: string;

  constructor(private http: HttpClient, private _router: Router) {
    //read config file to call the login api
    this.getConfigJSONFile().takeUntil(this.ngUnsubscribe).subscribe((data) => {
        //console.log(data)
        this.setApiProject(data.apiProject)
        this.serverUrl = data.serverApiUrl
    })
  }

  getConfigJSONFile(): Observable<any> {
    return this.http.get("../../assets/Urlconfig.json");
  }

  setApiProject(value: string){
    this.ApiProject = value
    localStorage.setItem('Project', this.ApiProject)
  }

  get sendApiProject(){
    return localStorage.getItem('Project') || this.ApiProject
  }

  setLoggedIn(value: boolean) {
    this.loggedInStatus = value
    localStorage.setItem('ChkloggedInStatus', this.loggedInStatus);
  }

  get isLoggedIn() {
    return JSON.parse(localStorage.getItem('ChkloggedInStatus')) || this.loggedInStatus;
  }

  getUserDetails(username, password): Observable<User> {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('username', username)
    .set('password', password)
      
    // post these details to API server return user info if correct
    return this.http.post<User>(this.serverUrl+'LoginServiceAPI/getLoginDetails', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  //sets Url for web api
  set apiServerUrl(urlIp){
    this.urlApi = 'http://'+urlIp+':'+environment.apiPort+'/'+this.sendApiProject+'/TrackingAPP/'
    localStorage.setItem('webApiUrl', this.urlApi)
  }
  //return Url for web api
  get apiUrl(){
    return localStorage.getItem('webApiUrl') || this.urlApi
  }

  logout(){
    let userDetail = JSON.parse(localStorage.getItem('currentUserInfo'))
    let browserName = localStorage.getItem('browserName')
    let featureData = JSON.parse(localStorage.getItem('featureAdrsAvailable'))
    if(browserName === "Chrome"){
      if(userDetail.accSqliteEnable == 0 && featureData){
        let db = (<any>window).openDatabase('RDPS', '', 'RDPS data', 2 * 1024 * 1024)
        db.transaction((tx) => {
          tx.executeSql('DROP TABLE RDPSTable');
        })
      }
    }
    this.setLoggedIn(false);
    localStorage.clear();
  }

  checkInternetConnection(){
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    )
    this.networkStatus()
    return this.online$
  }

  public networkStatus() {
    this.online$.subscribe(value => {
      if(!value){
        this._router.navigateByUrl('offline')
      }
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
