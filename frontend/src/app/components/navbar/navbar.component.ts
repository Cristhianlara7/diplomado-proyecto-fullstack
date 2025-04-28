import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Blog</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inicio</a>
            </li>
            <li class="nav-item" *ngIf="authService.isAuthenticated()">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <ng-container *ngIf="!authService.isAuthenticated(); else loggedIn">
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active">Iniciar Sesión</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/register" routerLinkActive="active">Registrarse</a>
              </li>
            </ng-container>
            <ng-template #loggedIn>
              <li class="nav-item">
                <a class="nav-link" routerLink="/profile" routerLinkActive="active">
                  <i class="bi bi-person-circle"></i> Mi Perfil
                </a>
              </li>
              <li class="nav-item">
                <button class="btn btn-link nav-link" (click)="logout($event)">
                  <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
                </button>
              </li>
            </ng-template>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(event: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
