import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;

  // Hacemos la inyeccion del modulo de HttpClient para las peticiones
  private http = inject( HttpClient );

  // Como vamos a manejar los usuarios? Ello lo hacemos con señales
  private _currentUser = signal<User|null>(null);

  // Debemos de verificar el estado de la autenticación, puede ser que este autenticado, que no este autenticado o que todavia no sepamos si esta autenticado.
  // Cuando montamos el servicio por primera vez el estado es: AuthStatus.checking
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );

  // Debemos de exponer algo al mundo exterior.
  public currentUser = computed( () => this._currentUser() ); // Esta señal es de solo lectura nadie puede cambiar los datos, no se puede usar el set ejemplo this.current.set para cambiar valores.
  public authStatus = computed( () => this._authStatus() );  // Nadie fuera de mi servicio puede realziar el cambiar el estado de autenticacion.

  constructor() {
    this.checkAuthStatus().subscribe();
  }


  // Creamos el siguiente metodo para no repetir código (Dry)
  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );
    localStorage.setItem('token', token);
    return true;
  }


  login( email: string, password: string ): Observable<boolean> {

    const url = `${ this.baseUrl }/auth/login`;
    // Este es el body de la petición que se va a enviar al backend
    const body = { email: email, password: password };

    // Con catchError manejamos los errores de la petición, por ejemplo que el password no es el correcto, porque el usuario no sabe que paso.
    return this.http.post<LoginResponse>( url, body )
      .pipe(
        map(({ user, token }) => this.setAuthentication( user, token )),

        //tap( ({ user, token }) => {
        //  this._currentUser.set( user );
        //  this._authStatus.set( AuthStatus.authenticated );
        //  localStorage.setItem('token', token);

        //  console.log({ user, token });
        //}),
        //map( () => true ),
        // Todo: errores
        catchError( err => throwError( () => err.error.message))
        //catchError( err => {
        //  console.log(err);
        //  return throwError( () => 'Algo no sucedió como lo esperaba');
        //})
      );
  }

  /* Creamos primero el servicio que nos pueda validar ese token que se genero */
  checkAuthStatus(): Observable<boolean> {

    /* Creamos la url */
    const url = `${ this.baseUrl }/auth/check-token`;
    /* Ocupamos el token */
    const token = localStorage.getItem('token');

    // Si no hay un token, en teoria retornamos un false
    //if ( !token ) return of(false);

    // Como despues de logout se estaba quedando en Loading se cambia el estado para que lo retorne a login
    if ( !token ) {
      this.logout();
      return of(false);
    }

    /* Para enviar los header */
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${ token }`);

    /* Haemos la peticion http */
    return this.http.get<CheckTokenResponse>(url, { headers: headers })
      .pipe(
        map(({ user, token }) => this.setAuthentication( user, token )),
        //map( ({ token, user }) => {
        //  this._currentUser.set( user );
        //  this._authStatus.set( AuthStatus.authenticated );
        //  localStorage.setItem('token', token);

        //  return true
        //}),
        // Error
        catchError(() => {
          this._authStatus.set( AuthStatus.notAuthenticated ); /* Aca notificamos que no esta autenticado, por ello asignamos este dato a this._authStatus */
          return of(false);
        })
      )
  }

  /* Serviicio para hacer la limpieza, aca se definen las señales que se deben de remover, destruir el token  */
  logout() {
    // Removemos el token, asi se remueva el token el usuario aun sigue autenticado
    localStorage.removeItem('token');
    // Por ello cambiamos los valores siguientes
    this._currentUser.set( null );
    this._authStatus.set( AuthStatus.notAuthenticated );
  }

}
