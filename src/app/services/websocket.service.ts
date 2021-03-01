import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
  
  constructor() {}
 
  private subject: Rx.Subject<MessageEvent>;
  public ws: any;
  public connect(webSocketUrl): Rx.Subject<MessageEvent> {
    this.subject = this.create(webSocketUrl);
    console.log("webSocketUrl", webSocketUrl)
    return this.subject;
  }

  private create(webSocketUrl): Rx.Subject<MessageEvent> {
    this.ws = new WebSocket(webSocketUrl);
    let observable = Rx.Observable.create(
      (obs: Rx.Observer<MessageEvent>) => {
        this.ws.onmessage = obs.next.bind(obs);
        this.ws.onerror = obs.error.bind(obs);
        this.ws.onclose = obs.complete.bind(obs);
        setInterval(() => {
          this.heartbeat();
        }, 3000);
    })
    let observer = {
      next: (data: Object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          var req = this.ws.send(JSON.stringify(data));
          // console.log("req", req)
        }
      }
    }
	  return Rx.Subject.create(observer, observable);
  }

  heartbeat(){
    // console.log("count ")
    if (!this.ws) return;
    if (this.ws.readyState !== 1) return;
    this.ws.send('ping')
  }
  closeConnection(){
    this.ws.close();
  }
  
}
