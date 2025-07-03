import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorInscripcionService } from '../../services/instructor-inscripcion.service';
import { InscripcionDetalleDTO } from '../../models/inscripciones.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inscripciones-procesadas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inscripciones-procesadas.component.html',
  styleUrls: ['./inscripciones-procesadas.component.css']
})
export class InscripcionesProcesadasComponent implements OnInit {
  inscripciones: InscripcionDetalleDTO[] = [];
  nombreBuscar: string = '';
  mes: number | null = null;
  anio: number | null = null;

  constructor(private inscripcionService: InstructorInscripcionService) {}
meses = [
  { numero: 1, nombre: 'Enero' },
  { numero: 2, nombre: 'Febrero' },
  { numero: 3, nombre: 'Marzo' },
  { numero: 4, nombre: 'Abril' },
  { numero: 5, nombre: 'Mayo' },
  { numero: 6, nombre: 'Junio' },
  { numero: 7, nombre: 'Julio' },
  { numero: 8, nombre: 'Agosto' },
  { numero: 9, nombre: 'Septiembre' },
  { numero: 10, nombre: 'Octubre' },
  { numero: 11, nombre: 'Noviembre' },
  { numero: 12, nombre: 'Diciembre' }
];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.inscripcionService
      .obtenerProcesadas(this.nombreBuscar, undefined, this.mes!, this.anio!)
      .subscribe(data => this.inscripciones = data);
  }
}
