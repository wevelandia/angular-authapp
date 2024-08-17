import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

    // Se debe de trabajar ahora es con formularios reactivos po ello se hace la inyeccion de FormBuilder.
    private fb = inject( FormBuilder );
    // Realizamos la inyeccion del servio de autenticación
    private authService = inject( AuthService );
    // Para cuando todo sale bien se navega al dashboard y para ello inyectamos lo siguiente:
    private router = inject( Router );

    // Lo que mi formulario va a tener
    public myForm: FormGroup = this.fb.group({
      // Aca se pueden colocar unas credenciales, y luego se deben de borrar para cuando se suba a Producción.
      email:    ['wvelandia@gmail.com', [ Validators.required, Validators.email ]],
      password: ['123456', [ Validators.required, Validators.minLength(6) ]],
    });

    login() {
      console.log( this.myForm.value );
      // Extraemos aca el email y password de myForm
      const { email, password  } = this.myForm.value;
      /*this.authService.login( email, password )
        .subscribe( success => {
          console.log({success});
        }); */

      // next: Si todo sale bien, sino error.
      this.authService.login( email, password )
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: (message) => {
          //console.log({ loginError: message });
          Swal.fire('Error', message, 'error')
        }
      });
    }

}
