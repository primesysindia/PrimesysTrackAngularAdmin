import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.css']
})
export class AppFooterComponent implements OnInit {

  constructor(private logServ:LoginService) { }

  ngOnInit() {
  }

  getLoginInfo(): boolean{
   return this.logServ.isLoggedIn;
  }
}
