import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorInscripcionService } from '../../services/instructor-inscripcion.service';
import { InscripcionDetalleDTO } from '../../models/inscripciones.model';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inscripciones-pendientes',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './inscripciones-pendientes.component.html',
  styleUrls: ['./inscripciones-pendientes.component.css']
})
export class InscripcionesPendientesComponent implements OnInit {
  inscripciones: InscripcionDetalleDTO[] = [];
  nombreBuscar: string = '';

  constructor(private inscripcionService: InstructorInscripcionService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.inscripcionService.obtenerPendientes(this.nombreBuscar).subscribe(data => {
      this.inscripciones = data;
    });
  }

  aprobar(inscripcion: InscripcionDetalleDTO): void {
  Swal.fire({
    title: '¿Aprobar inscripción?',
    text: `¿Estás seguro de aprobar a ${inscripcion.nombres} ${inscripcion.apellidos}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, aprobar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      this.inscripcionService.aprobar(inscripcion.idInscripcion).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Aprobado',
          text: 'La inscripción ha sido aprobada correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        this.cargar();
      });
    }
  });
}

rechazar(inscripcion: InscripcionDetalleDTO): void {
  Swal.fire({
    title: '¿Rechazar inscripción?',
    text: `¿Estás seguro de rechazar a ${inscripcion.nombres} ${inscripcion.apellidos}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, rechazar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      this.inscripcionService.rechazar(inscripcion.idInscripcion).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Rechazado',
          text: 'La inscripción ha sido rechazada correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        this.cargar();
      });
    }
  });
}

}
