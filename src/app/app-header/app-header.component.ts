import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from '../core/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {

  navbarOpen: boolean = false;
  isUserLoggedIn: boolean;
  loggedUserInfo: User;
  showPayment: boolean = true;
  showAdmin: boolean = false;
  showreportModule: boolean = false;
  USAUser: boolean = false;
  showTrackHistory: boolean = false;
  showHistory: boolean = true;
  showReport: boolean = true;
  showAdminTracker: boolean = false;
  constructor(private logServ: LoginService, private router: Router) { }

  ngOnInit() {
    this.getLoginStatus()
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  getCurrentUserName(){
    return this.loggedUserInfo.userName.charAt(0).toUpperCase() + this.loggedUserInfo.userName.substring(1)
  }

  getLoginStatus(){
    this.isUserLoggedIn = this.logServ.isLoggedIn;
     if(this.isUserLoggedIn){
       this.loggedUserInfo = JSON.parse(localStorage.getItem('currentUserInfo'))
       if(this.loggedUserInfo.socketUrl == '157.230.228.152'){
          this.USAUser = true;
          localStorage.setItem('USAUser',JSON.stringify(this.USAUser))
       }
       else{
          this.USAUser = false;
          localStorage.setItem('USAUser',JSON.stringify(this.USAUser))
       }
       if(this.loggedUserInfo.roleId == 7){
         this.showPayment = true;
         this.showreportModule = false;
       }
       else{
        this.showPayment = false;
       }
       if(this.loggedUserInfo.roleId == 19){
        this.showAdmin = true;
        this.showreportModule = false;
        this.showTrackHistory = true;
        this.showHistory = false;
        this.showReport = false;
      }
      else if(this.loggedUserInfo.roleId == 20){
        this.showAdmin = true;
        this.showreportModule = true;
        this.showTrackHistory = true;
        this.showHistory = false;
        this.showReport = false;
      }
      else{
       this.showAdmin = false;
       this.showreportModule = false;
      }
     }
     return this.isUserLoggedIn;
  }

  doLogout(){
    this.logServ.logout()
  }
}
