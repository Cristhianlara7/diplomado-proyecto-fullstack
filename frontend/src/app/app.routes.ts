import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'posts/new',
    loadComponent: () => import('./components/posts/create-post/create-post.component').then(m => m.CreatePostComponent),
    canActivate: [authGuard]
  },
  {
    path: 'posts/:id',
    loadComponent: () => import('./components/posts/post-detail/post-detail.component').then(m => m.PostDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'posts/edit/:id',
    loadComponent: () => import('./components/posts/edit-post/edit-post.component').then(m => m.EditPostComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
