import { Routes } from "@angular/router";

export const vehiculoRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import(
            './pages/vehiculo-listar/vehiculo-listar.component').then(m => m.VehiculoListarComponent)
    }
]