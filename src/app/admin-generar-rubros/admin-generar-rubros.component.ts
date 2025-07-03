import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../services/pago.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-generar-rubros',
   standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-generar-rubros.component.html',
  styleUrl: './admin-generar-rubros.component.css'
})
export class AdminGenerarRubrosComponent {
  anio: number = new Date().getFullYear();
  mesInicio: number = 1;

  constructor(private pagoService: PagoService) {}

   generarRubros() {
    this.pagoService.generarRubros(this.anio, this.mesInicio).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Rubros generados!',
          text: `Se generaron correctamente los rubros para ${this.anio} iniciando en ${this.mesInicio === 1 ? 'Enero' : 'Julio'}.`,
          timer: 3000,
          showConfirmButton: false
        });
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.error || 'Error desconocido al generar los rubros.'
        });
      }
    });
  }
}
