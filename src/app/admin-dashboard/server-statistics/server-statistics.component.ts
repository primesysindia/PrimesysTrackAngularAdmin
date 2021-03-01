import { Component, OnInit } from '@angular/core';
import { onMainContentChange } from '../../core/animation';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-server-statistics',
  templateUrl: './server-statistics.component.html',
  styleUrls: ['./server-statistics.component.css'],
  animations: [ onMainContentChange ]
})
export class ServerStatisticsComponent implements OnInit {

  public onSideNavChange: boolean;
  constructor(
    private _sidenavService: SidenavService) { 
      this._sidenavService.sideNavState$.subscribe( res => {
        this.onSideNavChange = res;
      })
    }

  ngOnInit() {
  }

}
