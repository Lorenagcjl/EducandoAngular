import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoService } from '../../services/pago.service';
import { PagoDetalleDTO } from '../../models/pago.model';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-pagos-pendientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-pagos-pendientes.component.html'
})
export class AdminPagosPendientesComponent implements OnInit {
  pagos: PagoDetalleDTO[] = [];
  cargando = false;
  error: string | null = null;
  

  constructor(private pagoService: PagoService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.obtenerPagosPendientes();
  }

  obtenerPagosPendientes(): void {
    this.cargando = true;
    this.error = null;
    this.pagoService.getPagosPendientes().subscribe({
      next: (data) => {
        this.pagos = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar pagos pendientes';
        this.cargando = false;
      }
    });
  }

  procesarPago(idPago: number, aprobar: boolean): void {
  Swal.fire({
    title: `¿Estás seguro de ${aprobar ? 'aprobar' : 'rechazar'} este pago?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: aprobar ? 'Aprobar' : 'Rechazar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then(result => {
    if (result.isConfirmed) {
      this.pagoService.procesarPago(idPago, aprobar).subscribe({
        next: () => {
          this.obtenerPagosPendientes();
          Swal.fire({
            title: '¡Éxito!',
            text: `El pago ha sido ${aprobar ? 'aprobado' : 'rechazado'} correctamente.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'Error al procesar el pago.',
            icon: 'error'
          });
        }
      });
    }
  });
}

  descargarComprobante(idPago: number): void {
    this.pagoService.descargarComprobante(idPago).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprobante_pago_${idPago}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      alert('No se pudo descargar el comprobante');
    });
  }
}
