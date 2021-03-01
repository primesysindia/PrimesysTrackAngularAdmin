import { Component, HostListener, OnInit } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { NavigationCancel, Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  innerWidth: number = 0;
  showMobileView: boolean = false;

  constructor(private _loadingBar: SlimLoadingBarService,
              private _router: Router,
              private logServ: LoginService) {
    this._router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    })
    //to check internet connectivity
    this.logServ.checkInternetConnection()
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    //console.log(this.innerWidth)
    if(this.innerWidth<=500)
      this.showMobileView = true
    else
      this.showMobileView = false
  }

  skipDownloadApp(){
    this.showMobileView = false
  }
  
  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this._loadingBar.start();
    }
    if (event instanceof NavigationEnd) {
      this._loadingBar.complete();
    }
    if (event instanceof NavigationCancel) {
      this._loadingBar.stop();
    }
    if (event instanceof NavigationError) {
      this._loadingBar.stop();
    }
  }
  
  //To clear local storage on window close
  /* @HostListener("window:onbeforeunload",["$event"])
  clearLocalStorage(event){
      localStorage.clear();
  } */

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
}
