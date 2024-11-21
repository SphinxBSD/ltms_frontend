import { Routes } from "@angular/router";

export const unidadTransporteRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import(
            './pages/unidad-transporte/unidad-transporte.component').then(m => m.UnidadTransporteComponent)
    }
];