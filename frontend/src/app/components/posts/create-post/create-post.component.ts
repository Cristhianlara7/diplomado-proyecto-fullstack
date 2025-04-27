import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <h2 class="text-center mb-4">Crear Nuevo Post</h2>
              
              <div class="alert alert-danger" *ngIf="errorMessage">
                {{ errorMessage }}
              </div>

              <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="title" class="form-label">Título</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="title" 
                    formControlName="title"
                    [ngClass]="{'is-invalid': submitted && postForm.get('title')?.errors}"
                  >
                  <div class="invalid-feedback" *ngIf="submitted && postForm.get('title')?.errors?.['required']">
                    El título es requerido
                  </div>
                </div>

                <div class="mb-3">
                  <label for="content" class="form-label">Contenido</label>
                  <textarea 
                    class="form-control" 
                    id="content" 
                    rows="6"
                    formControlName="content"
                    [ngClass]="{'is-invalid': submitted && postForm.get('content')?.errors}"
                  ></textarea>
                  <div class="invalid-feedback" *ngIf="submitted && postForm.get('content')?.errors?.['required']">
                    El contenido es requerido
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary">Publicar Post</button>
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
export class CreatePostComponent {
  postForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.postForm.valid) {
      this.postService.createPost(this.postForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error al crear el post. Por favor, intente nuevamente.';
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}