import { Injectable } from '@angular/core';
import { User } from '../core/user.model';
import { HttpClient } from '@angular/common/http';
import { ParentUserList } from '../core/post';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { Observable, interval, throwError, of } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})

export class UserDataService {
  currUserData: User;
  localApi : any = 'http://123.252.246.214:8080/TrackingAppDB/TrackingAPP/'
  searchOption=[]
  public ParentData: ParentUserList[]
  constructor(private http: HttpClient, private logServ: LoginService) {}

  getAllParentId(){
    var res = this.http.get(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetAllTrackUser')
      return res .pipe(
        //retry upto 3 times after getting error from server
        retryWhen((error:any) => {
          return interval(5000).pipe(
            mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
          )}
        )
      )
  }

  filteredListOptions() {
    let posts = this.ParentData;

        let filteredPostsList = [];
        for (let post of posts) {
            for (let options of this.searchOption) {
                if (options.Name === post.Name) {
                  filteredPostsList.push(post);
                }
            }
        }
        // console.log("filter list options", filteredPostsList);
        return filteredPostsList;
  }

  usersList() {
    return this.http.get('https://jsonplaceholder.typicode.com/users')
  }
}