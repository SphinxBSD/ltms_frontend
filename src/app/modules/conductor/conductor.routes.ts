import { Routes } from "@angular/router";

export const conductorRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import(
            './pages/conductor-listar/conductor-listar.component').then(m => m.ConductorListarComponent)
    },
    {
        path: 'registrar',
        loadComponent: () => import(
            './pages/conductor-registrar/conductor-registrar.component').then(m => m.ConductorRegistrarComponent)
    },
    {
        path: 'informacion/:idConductor',
        loadComponent: () => import(
            './pages/conductor-informacion/conductor-informacion.component').then(m => m.ConductorInformacionComponent)
        
    }
];