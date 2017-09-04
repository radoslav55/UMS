import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";

declare var $:any;

@Component({
    selector: 'login-form',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    model: any = {};
    loading = false;
    authMessage:any;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    login() {

        this.authMessage = false;

        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {

                if (result === true) {
                    this.router.navigate(['/']);
                } else {

                    this.authMessage = {
                        status: 'danger',
                        msg: 'Wrong username or password'
                    };
                    this.loading = false;
                }
            });
    }
}
