import { Routes } from "@angular/router";

export const parametrosRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import(
            './pages/parametros-menu/parametros-menu.component').then(m => m.ParametrosMenuComponent)
    }
]