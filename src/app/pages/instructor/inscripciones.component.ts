import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionesPendientesComponent } from './inscripciones-pendientes.component';
import { InscripcionesProcesadasComponent } from './inscripciones-procesadas.component';

@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [CommonModule, InscripcionesPendientesComponent, InscripcionesProcesadasComponent],
  templateUrl: './inscripciones.component.html',
  styleUrls:['./inscripciones.component.css']
})
export class InscripcionesComponent {
  activeTab: string = 'pendientes';
}
