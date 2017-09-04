import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component'
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {AuthGuard} from "./guards/auth.guard";
import {GuestGuard} from "./guards/guest.guard";

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [GuestGuard]
    },
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    }
];

export const routing = RouterModule.forRoot(appRoutes);
