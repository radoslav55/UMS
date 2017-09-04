import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { HttpModule }    from '@angular/http';

import {AppComponent} from './app.component';
import {routing} from "./app.routing";
import {LoginComponent} from "./components/login/login.component";
import {UserService} from "app/services/user.service";

import { mockServerProvider } from './providers/mock-server';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
import {AuthenticationService} from "./services/authentication.service";

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {RoleService} from "./services/role.service";
import {AuthGuard} from "./guards/auth.guard";
import {GuestGuard} from "./guards/guest.guard";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        routing
    ],
    providers: [
        UserService,
        RoleService,
        AuthenticationService,
        mockServerProvider,
        MockBackend,
        BaseRequestOptions,
        AuthGuard,
        GuestGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
