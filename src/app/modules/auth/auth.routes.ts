import { Routes } from "@angular/router";
import { AuthLoginComponent } from "./pages/auth-login/auth-login.component";

export const authRoutes: Routes = [
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: AuthLoginComponent,
    }
];