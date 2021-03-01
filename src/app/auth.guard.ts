import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { LoginService } from "./services/login.service";

@Injectable()
export class AuthGuard implements CanActivate{
    
    constructor(private logServ: LoginService, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
          //debugger

          if(this.logServ.isLoggedIn) { 
            // logged in so return true
            return true
          }
          else{       
            // not logged in so redirect to login page with the return url and return false
            this.router.navigate(['login'], { queryParams: { returnUrl: 'home' }});
            return false;
          }           
    }
}