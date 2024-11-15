import { Routes } from "@angular/router";

export const vehiculoRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import(
            './pages/vehiculo-listar/vehiculo-listar.component').then(m => m.VehiculoListarComponent)
    },
    {
        path: 'registrar',
        loadComponent: () => import(
            './pages/vehiculo-registrar/vehiculo-registrar.component').then(m => m.VehiculoRegistrarComponent)
    },
    {
        path: 'informacion/:idVehiculo',
        loadComponent: () => import(
            './pages/vehiculo-informacion/vehiculo-informacion.component').then(m => m.VehiculoInformacionComponent)
    }
]