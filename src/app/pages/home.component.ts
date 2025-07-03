import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormularioInscripcionComponent } from './home/formulario-inscripcion.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormularioInscripcionComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  irAlLogin() {
    this.router.navigate(['/login']);
  }
}
