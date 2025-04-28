import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <h2 class="text-center mb-4">Mi Perfil</h2>
              
              <div class="alert alert-success" *ngIf="successMessage">
                {{ successMessage }}
              </div>
              
              <div *ngIf="!isEditing" class="profile-view">
                <div class="text-center mb-4">
                  <div class="avatar-circle">
                    <span class="initials">{{getInitials(userData?.name || '')}}</span>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold">Nombre:</label>
                  <p>{{userData?.name}}</p>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold">Email:</label>
                  <p>{{userData?.email}}</p>
                </div>

                <div class="d-grid gap-2">
                  <button class="btn btn-primary" (click)="toggleEdit()">
                    Editar Perfil
                  </button>
                </div>
              </div>

              <form *ngIf="isEditing" [formGroup]="profileForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="name" class="form-label">Nombre</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="name" 
                    formControlName="name"
                    [ngClass]="{'is-invalid': submitted && profileForm.get('name')?.errors}"
                  >
                  <div class="invalid-feedback" *ngIf="submitted && profileForm.get('name')?.errors?.['required']">
                    El nombre es requerido
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    formControlName="email"
                    [ngClass]="{'is-invalid': submitted && profileForm.get('email')?.errors}"
                  >
                  <div class="invalid-feedback" *ngIf="submitted && profileForm.get('email')?.errors?.['required']">
                    El email es requerido
                  </div>
                  <div class="invalid-feedback" *ngIf="submitted && profileForm.get('email')?.errors?.['email']">
                    Por favor ingresa un email válido
                  </div>
                </div>

                <div class="mb-3">
                  <label for="currentPassword" class="form-label">Contraseña Actual</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="currentPassword" 
                    formControlName="currentPassword"
                  >
                </div>

                <div class="mb-3">
                  <label for="newPassword" class="form-label">Nueva Contraseña (opcional)</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="newPassword" 
                    formControlName="newPassword"
                  >
                </div>

                <div class="alert alert-danger" *ngIf="errorMessage">
                  {{errorMessage}}
                </div>

                <div class="alert alert-danger" *ngIf="errorMessage">
                  {{ errorMessage }}
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                  <button type="button" class="btn btn-secondary" (click)="toggleEdit()">Cancelar</button>
                </div>
              </form>
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
    </style>
  `
})
export class ProfileComponent implements OnInit {
  isEditing = false;
  profileForm: FormGroup;
  submitted = false;
  errorMessage = '';
  successMessage = ''; 
  userData: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: ['']
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.userData = data;
        this.profileForm.patchValue({
          name: data.name,
          email: data.email
        });
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los datos del perfil';
        console.error('Error:', error);
      }
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.reset();
      this.loadUserData();
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';  // Limpiar mensaje de éxito

    if (this.profileForm.valid) {
      this.authService.updateProfile(this.profileForm.value).subscribe({
        next: (response) => {
          this.userData = response;
          this.isEditing = false;
          this.submitted = false;
          if (this.profileForm.get('newPassword')?.value) {
            this.successMessage = 'Contraseña actualizada exitosamente';
          }
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error al actualizar el perfil';
        }
      });
    }
  }
}