import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces';

/* Este guard se crea para asegurarnos de que ingrese a una ruta siempre y cuando este autenticado */
export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  // Aca debemos de retornar un true si estamos autenticados, sino se retorn un false.

  // Tomamos el URL del usuario a donde quiere ir.
  //const url = state.url;
  //console.log({url});
  // podemos enviar a nuestro localstorage la url ultima a la que el usuario ingresa así:
  //localStorage.setItem('url', url);

  //console.log('isAuthenticatedGuard');
  //console.log({ route, state });

  const authService = inject( AuthService );
  const router = inject( Router );

  console.log({ status: authService.authStatus() });

  // Si estamos autenticados
  if ( authService.authStatus() === AuthStatus.authenticated ) {
    return true;
  }

  if ( authService.authStatus() === AuthStatus.checking ) {
    return false;
  }

  // Si no estamos autenticados
  router.navigateByUrl('auth/login');

  //console.log('isAuthenticatedGuard');
  //console.log({ route, state });

  //return false; // Si se retorna un false se va a ver que la ruta ni siquiera se cargo.
  return false;
};
