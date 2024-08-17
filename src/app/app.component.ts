import { Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Toda aplicación pasa por acá
  title = 'authApp';
  private authService = inject( AuthService );
  private router = inject( Router );

  // Definimos una variable que dependiendo del servicio me diga si logre determinar la autenticación
 public finishAuthChek = computed( () => {
  // Si todavia no he terminado de chequearlo
  if ( this.authService.authStatus() === AuthStatus.checking ) {
    return false;
  }

  // Si ya termino de chequearlo
  return true;

 });

 /* Creamos un efecto */
 public authStatusChangedEffect = effect( () => {

    //console.log('authStatus: ', this.authService.authStatus());
    switch( this.authService.authStatus() ) {

      case AuthStatus.checking:
        return;

      case AuthStatus.authenticated:
        this.router.navigateByUrl('/dashboard');
        return; // O Break

      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/auth/login');
        return;
    }

 });

}
