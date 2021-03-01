import { Component, OnInit } from '@angular/core';
import { Observable, merge, of, fromEvent, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.css']
})
export class OfflineComponent implements OnInit {

  online$: Observable<boolean>;
  //spinner
  public loading:boolean = false;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private _router: Router) { }

  ngOnInit() {
  }

  retryConnection(){
    this.loading = true;
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    )
    this.networkStatus()
  }

  public networkStatus() {
    this.online$.takeUntil(this.ngUnsubscribe)
    .subscribe(value => {
      if(value){
        this._router.navigateByUrl('home')
      }
      else
        this.loading = false;
        return
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
