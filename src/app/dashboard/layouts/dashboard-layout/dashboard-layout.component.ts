import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {
  /* Tomamos nuestro servicio */
  private authService = inject( AuthService );
  /* Definimos una propiedad computada para obtener el usuario actualizado */
  public user = computed( () => this.authService.currentUser() );

  // Esta es una opcion para hacerlo
  /* get user(){
    return this.authService.currentUser();
  } */

    // Creamos el metodo onLogout
    onLogout() {
      this.authService.logout(); // Aca no requerimos de pasar a otra pagina ya que en nuesto app.component allí si no esta autenticado pasa a login.
    }

}
