import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <h2 class="text-center mb-4">Editar Post</h2>
              
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
                  <button type="submit" class="btn btn-primary">Actualizar Post</button>
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
export class EditPostComponent implements OnInit {
  postForm: FormGroup;
  submitted = false;
  errorMessage = '';
  postId: string = '';

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id') || '';
    if (this.postId) {
      this.loadPost();
    } else {
      this.errorMessage = 'ID del post no encontrado';
      this.router.navigate(['/dashboard']);
    }
  }

  loadPost() {
    this.postService.getPost(this.postId).subscribe({
      next: (post) => {
        this.postForm.patchValue({
          title: post.title,
          content: post.content
        });
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error al cargar el post';
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.postForm.valid) {
      this.postService.updatePost(this.postId, this.postForm.value).subscribe({
        next: () => {
          this.router.navigate(['/posts', this.postId]);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error al actualizar el post. Por favor, intente nuevamente.';
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/posts', this.postId]);
  }
}