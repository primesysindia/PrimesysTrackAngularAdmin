import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { onSideNavChange, animateText } from '../core/animation'
import { SidenavService } from '../services/sidenav.service'

interface Page {
  link: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-select-example',
  templateUrl: './select-example.component.html',
  styleUrls: ['./select-example.component.css'],
  animations: [onSideNavChange, animateText]
})
export class SelectExampleComponent implements OnInit {
  showPayment: boolean = false;
  showDeviceUnregister: boolean = false;
  public sideNavState: boolean = false;
  public linkText: boolean = false;

  public pages: Page[] = [
    {name: 'Inbox', link:'some-link', icon: 'inbox'},
    {name: 'Starred', link:'some-link', icon: 'star'},
    {name: 'Send email', link:'some-link', icon: 'send'},
  ]

  constructor(private _sidenavService: SidenavService) { }

  ngOnInit() {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var roleId = userInfo.roleId;
    if( roleId == 20) {
      this.showPayment = true;
      this.showDeviceUnregister = true;
    }
  }

  onSinenavToggle() {
    this.sideNavState = !this.sideNavState
    
    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200)
    this._sidenavService.sideNavState$.next(this.sideNavState)
  }
  
}