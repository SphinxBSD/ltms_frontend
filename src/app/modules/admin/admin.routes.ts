import {Routes} from "@angular/router";
import { PrincipalComponent } from "./layout/principal/principal.component";

export const adminRoutes: Routes = [
    {
        path: '',
        component: PrincipalComponent,
        children: [
            {
                path: '',
                redirectTo: 'usuarios',
                pathMatch: 'full'
            },
            {
                path: 'usuarios',
                loadChildren: () => import('../usuario/usuario.routes').then(m => m.usuarioRoutes),
                title: 'App - Usuarios'
            },
            {
                path: 'conductores',
                loadChildren: () => import('../conductor/conductor.routes').then(m => m.conductorRoutes),
                title: 'App - Conductores'
            },
            {
                path: 'vehiculos',
                loadChildren: () => import('../vehiculo/vehiculo.routes').then(m => m.vehiculoRoutes),
                title: 'App - Vehiculos'
            },
            {
                path: 'parametros',
                loadChildren: () => import('../parametros/parametros.routes').then(m => m.parametrosRoutes),
                title: 'App - Parametros'

            },
            {
                path: 'unidades-transporte',
                loadChildren: () => import('../unidad-transporte/unidad-transporte.routes').then(m => m.unidadTransporteRoutes),
                title: 'App - Unidades de Transporte'
            }
        ]
    }
];