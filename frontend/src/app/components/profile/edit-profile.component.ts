import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title text-center mb-4">Editar Perfil</h2>

              <div *ngIf="errorMessage" class="alert alert-danger">
                {{errorMessage}}
              </div>

              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
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

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                  <button type="button" class="btn btn-secondary" (click)="cancel()">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
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
    const token = this.authService.getToken();
    this.http.get('http://localhost:3001/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (data: any) => {
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

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.profileForm.valid) {
      const token = this.authService.getToken();
      this.http.put('http://localhost:3001/api/auth/profile', this.profileForm.value, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe({
        next: () => {
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error al actualizar el perfil';
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}