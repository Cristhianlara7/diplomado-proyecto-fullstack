import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="jumbotron text-center my-4">
        <h1 class="display-4">Bienvenido a nuestro Blog</h1>
        <p class="lead">Comparte tus ideas y conocimientos con la comunidad</p>
        <hr class="my-4">
        <p>Únete a nuestra comunidad y comienza a compartir tus historias</p>
        <a class="btn btn-primary btn-lg" routerLink="/register" role="button">Registrarse</a>
      </div>
      
      <div class="row">
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Comparte tus Ideas</h5>
              <p class="card-text">Crea y publica contenido interesante para la comunidad.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Conecta con Otros</h5>
              <p class="card-text">Interactúa con otros miembros de la comunidad.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Aprende y Crece</h5>
              <p class="card-text">Descubre nuevo contenido y amplía tus conocimientos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}
