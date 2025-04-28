import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card mt-5">
            <div class="card-body">
              <h2 class="text-center mb-4">Iniciar Sesión</h2>
              
              <div class="alert alert-danger" *ngIf="errorMessage">
                {{ errorMessage }}
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Correo Electrónico</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    formControlName="email"
                    [ngClass]="{'is-invalid': submitted && loginForm.get('email')?.errors}"
                  >
                  <div class="invalid-feedback" *ngIf="submitted && loginForm.get('email')?.errors?.['required']">
                    El correo electrónico es requerido
                  </div>
                  <div class="invalid-feedback" *ngIf="submitted && loginForm.get('email')?.errors?.['email']">
                    Ingrese un correo electrónico válido
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    formControlName="password"
                    [ngClass]="{'is-invalid': submitted && loginForm.get('password')?.errors}"
                  >
                  <div class="invalid-feedback" *ngIf="submitted && loginForm.get('password')?.errors?.['required']">
                    La contraseña es requerida
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
                  <a routerLink="/register" class="btn btn-link">¿No tienes cuenta? Regístrate</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error al iniciar sesión. Por favor, intente nuevamente.';
        }
      });
    }
  }
}
