import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // <-- Corregido
})
export class AppComponent {
  title = 'EducandoAngular';

  constructor() {
    console.log('AppComponent cargado');
  }
}


