import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeriodoInscripcionService, PeriodoInscripcion } from '../services/periodo-inscripcion.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-periodos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-periodos.component.html',
  styleUrls: ['./admin-periodos.component.css'] 
})
export class AdminPeriodosComponent implements OnInit {
  periodos: PeriodoInscripcion[] = [];

  nuevoPeriodo: PeriodoInscripcion = {
    nombrePeriodo: '',
    fechaInicio: '',
    fechaFin: ''
  };

  constructor(private periodoService: PeriodoInscripcionService) {}

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.periodoService.obtenerTodos().subscribe(data => {
      this.periodos = data;
    });
  }

  crearPeriodo(): void {
  if (!this.nuevoPeriodo.nombrePeriodo || !this.nuevoPeriodo.fechaInicio || !this.nuevoPeriodo.fechaFin) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos del nuevo periodo.',
    });
    return;
  }

  const periodoAMayusculas = {
    ...this.nuevoPeriodo,
    nombrePeriodo: this.nuevoPeriodo.nombrePeriodo.toUpperCase()
  };

  this.periodoService.crear(periodoAMayusculas).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: '¡Periodo creado!',
        text: 'El periodo se ha creado correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
      this.nuevoPeriodo = { nombrePeriodo: '', fechaInicio: '', fechaFin: '' };
      this.cargarPeriodos();
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear',
        text: 'Error al crear periodo: ' + err.message
      });
    }
  });
}
activarPeriodo(id: number): void {
  Swal.fire({
    title: '¿Desea activar este periodo?',
    text: 'Esto desactivará el actual activo.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, activar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.periodoService.activar(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Periodo activado',
            text: 'El periodo se activó correctamente.',
            timer: 2000,
            showConfirmButton: false
          });
          this.cargarPeriodos();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al activar',
            text: 'Error al activar periodo: ' + err.message
          });
        }
      });
    }
  });
}

}
