import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../interfaces/post.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Mi Dashboard</h2>
        <button class="btn btn-primary" routerLink="/posts/new">Crear Nuevo Post</button>
      </div>

      <div class="alert alert-info" *ngIf="posts.length === 0">
        No tienes posts publicados aún.
      </div>

      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let post of posts">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{post.title}}</h5>
              <p class="card-text">{{post.content | slice:0:100}}...</p>
              <div class="d-flex justify-content-between">
                <button class="btn btn-sm btn-primary" [routerLink]="['/posts', post._id]">Ver</button>
                <button class="btn btn-sm btn-danger" (click)="deletePost(post._id)">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => {
        console.error('Error cargando posts:', error);
      }
    });
  }

  deletePost(id: string | undefined) {
    if (!id) return;
    
    if (confirm('¿Estás seguro de que deseas eliminar este post?')) {
      this.postService.deletePost(id).subscribe({
        next: () => {
          this.posts = this.posts.filter(post => post._id !== id);
        },
        error: (error) => {
          console.error('Error eliminando post:', error);
        }
      });
    }
  }
}
