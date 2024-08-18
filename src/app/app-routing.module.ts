import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './auth/guards';

// Aca definimos como vasmos a llegar a las otras rutas
// La primera ruta es la de Autenticacion: auth
// La segunda ruta es la de Dashboard: dashboard
// Si no es ninguna ruta de esas lo redireccionamos a auth, pero deberia ser a login porque ya puede uno estar autenticado, ello se va a manejar mas adelante.
const routes: Routes = [
  {
    path: 'auth',
    canActivate: [ isNotAuthenticatedGuard ],
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ),
  },
  {
    path: 'dashboard',
    // guards: Para ingresar a esta ruta debo de estar autenticado, por ello se pone la siguiente linea.
    // El guard de isAuthenticatedGuard se creo con el comnado: ng g @schematics/angular:guard auth/gcated --functional
    canActivate: [ isAuthenticatedGuard ],
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardModule ),
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

/* Adicionamos un parametro en forRoot para que las paginas que se visitan son exclusivamente angular, ello para que me interprete las rutas /auth/login y no las tome como una carpeta */
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
