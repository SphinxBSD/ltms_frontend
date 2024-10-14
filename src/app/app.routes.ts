import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

export const routes: Routes = [
        {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.routes').then(m => m.adminRoutes),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];
