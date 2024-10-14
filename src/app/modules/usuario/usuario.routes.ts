import { Routes } from "@angular/router";

export const usuarioRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import(
            './pages/usuario-listar/usuario-listar.component').then(m => m.UsuarioListarComponent)
    },
    {
        path: 'registrar',
        loadComponent: () => import(
            './pages/usuario-registrar/usuario-registrar.component').then(m => m.UsuarioRegistrarComponent)
    },
    {
        path: 'editar',
        loadComponent: () => import(
            './pages/usuario-editar/usuario-editar.component').then(m => m.UsuarioEditarComponent)
    }
];