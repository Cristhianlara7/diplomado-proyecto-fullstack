import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card mt-5">
            <div class="card-body">
              <h2 class="text-center mb-4">Registro</h2>
              
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="name" class="form-label">Nombre</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="name" 
                    formControlName="name"
                    [ngClass]="{'is-invalid': submitted && registerForm.get('name')?.errors}"
                  >
                  <div class="invalid-feedback" *ngIf="submitted && registerForm.get('name')?.errors?.['required']">
                    El nombre es requerido
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Correo Electrónico</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    formControlName="email"
                    [ngClass]="{'is-invalid': submitted && registerForm.get('email')?.errors}"
                  >
                  <div class="invalid-feedback" *ngIf="submitted && registerForm.get('email')?.errors?.['required']">
                    El correo electrónico es requerido
                  </div>
                  <div class="invalid-feedback" *ngIf="submitted && registerForm.get('email')?.errors?.['email']">
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
                    [ngClass]="{'is-invalid': submitted && registerForm.get('password')?.errors}"
                  >
                  <div class="invalid-feedback" *ngIf="submitted && registerForm.get('password')?.errors?.['required']">
                    La contraseña es requerida
                  </div>
                  <div class="invalid-feedback" *ngIf="submitted && registerForm.get('password')?.errors?.['minlength']">
                    La contraseña debe tener al menos 6 caracteres
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="confirmPassword" 
                    formControlName="confirmPassword"
                    [ngClass]="{'is-invalid': submitted && registerForm.get('confirmPassword')?.errors}"
                  >
                  <div class="invalid-feedback" *ngIf="submitted && registerForm.get('confirmPassword')?.errors?.['required']">
                    Confirmar la contraseña es requerido
                  </div>
                  <div class="invalid-feedback" *ngIf="submitted && registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">
                    Las contraseñas no coinciden
                  </div>
                </div>

                <div class="d-grid">
                  <button type="submit" class="btn btn-primary">Registrarse</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="alert alert-danger" *ngIf="errorMessage">
      {{ errorMessage }}
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : {'passwordMismatch': true};
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registerForm.valid) {
      const userData = {
        name: this.registerForm.get('name')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value
      };

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error en el registro. Por favor, intente nuevamente.';
        }
      });
    }
  }
}
