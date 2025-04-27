import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../interfaces/post.interface';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <div *ngIf="post">
                <h2 class="card-title mb-4">{{post.title}}</h2>
                <p class="text-muted">
                  Publicado: {{post.createdAt | date:'medium'}}
                </p>
                <div class="card-text mb-4">
                  {{post.content}}
                </div>
                <div class="d-flex justify-content-between">
                  <button class="btn btn-primary" (click)="goBack()">Volver</button>
                  <div>
                    <button class="btn btn-warning me-2" (click)="editPost()">Editar</button>
                    <button class="btn btn-danger" (click)="deletePost()">Eliminar</button>
                  </div>
                </div>
              </div>
              
              <div *ngIf="errorMessage" class="alert alert-danger mt-3">
                {{errorMessage}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(id);
    } else {
      this.errorMessage = 'ID del post no encontrado';
    }
  }

  loadPost(id: string) {
    this.postService.getPost(id).subscribe({
      next: (post) => {
        this.post = post;
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error al cargar el post';
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  editPost() {
    if (this.post?.id) {
      this.router.navigate(['/posts/edit', this.post.id]);
    }
  }

  deletePost() {
    if (!this.post?.id) return;

    if (confirm('¿Estás seguro de que deseas eliminar este post?')) {
      this.postService.deletePost(this.post.id).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error al eliminar el post';
        }
      });
    }
  }
}