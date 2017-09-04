import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthenticationService, private router: Router) {}

    canActivate() {

        if(!this.authService.authenticated){

            this.router.navigate(['login']);

            return false;
        }

        return true;
    }
}
