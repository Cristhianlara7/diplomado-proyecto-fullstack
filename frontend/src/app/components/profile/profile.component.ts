import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <div class="text-center mb-4">
                <h2 class="card-title">Mi Perfil</h2>
                <div class="profile-avatar mb-3">
                  <!-- Placeholder para avatar futuro -->
                  <div class="avatar-circle">
                    <span class="initials">{{getUserInitials()}}</span>
                  </div>
                </div>
              </div>

              <div class="profile-info">
                <div class="mb-3">
                  <label class="form-label fw-bold">Nombre:</label>
                  <p>{{userData?.name || 'Cargando...'}}</p>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold">Email:</label>
                  <p>{{userData?.email || 'Cargando...'}}</p>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold">Fecha de registro:</label>
                  <p>{{userData?.createdAt | date:'mediumDate'}}</p>
                </div>

                <div class="d-grid gap-2">
                  <button class="btn btn-primary" routerLink="/profile/edit">
                    Editar Perfil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      .avatar-circle {
        width: 100px;
        height: 100px;
        background-color: #007bff;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
      }

      .initials {
        font-size: 40px;
        color: white;
        text-transform: uppercase;
      }

      .profile-info {
        max-width: 600px;
        margin: 0 auto;
      }
    </style>
  `
})
export class ProfileComponent implements OnInit {
  userData: any = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const token = this.authService.getToken();
    this.http.get('http://localhost:3001/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (data: any) => {
        this.userData = data;
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
      }
    });
  }

  getUserInitials(): string {
    if (!this.userData?.name) return '?';
    return this.userData.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2);
  }
}