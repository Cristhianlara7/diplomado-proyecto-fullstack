import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center text-center">
        <div class="col-md-8">
          <h1 class="display-4 mb-4">Bienvenido a BlogApp</h1>
          <p class="lead mb-4">
            Tu espacio personal para compartir ideas, historias y experiencias.
          </p>
          
          <div class="mb-5">
            <p class="mb-4">
              Crea, gestiona y comparte tus publicaciones de manera sencilla y profesional.
            </p>
          </div>

          <div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <ng-container *ngIf="!isAuthenticated(); else authenticatedButtons">
              <button class="btn btn-primary btn-lg px-4" routerLink="/register">
                Registrarse
              </button>
              <button class="btn btn-outline-primary btn-lg px-4" routerLink="/login">
                Iniciar Sesión
              </button>
            </ng-container>
            
            <ng-template #authenticatedButtons>
              <button class="btn btn-primary btn-lg px-4" routerLink="/dashboard">
                Ir al Dashboard
              </button>
            </ng-template>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h3 class="card-title">Crea</h3>
              <p class="card-text">
                Escribe y publica tus historias con un editor fácil de usar.
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h3 class="card-title">Gestiona</h3>
              <p class="card-text">
                Organiza y edita tus publicaciones desde un dashboard intuitivo.
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h3 class="card-title">Comparte</h3>
              <p class="card-text">
                Comparte tus publicaciones y conecta con otros usuarios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
