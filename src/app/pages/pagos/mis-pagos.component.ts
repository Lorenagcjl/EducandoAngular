import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../../services/pago.service';
import { PagoDetalleDTO } from '../../models/pago.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-pagos',
  templateUrl: './mis-pagos.component.html',
  styleUrls: ['./mis-pagos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class MisPagosComponent implements OnInit {
  pagos: PagoDetalleDTO[] = [];
  pagosFiltrados: PagoDetalleDTO[] = []; // Nuevo: pagos filtrados
  filtroMotivo: string = ''; // Nuevo: texto del filtro
  cargando = false;
  error: string | null = null;

  constructor(private pagoService: PagoService) {}

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.cargando = true;
    this.error = null;
    this.pagoService.obtenerMisPagos().subscribe({
      next: pagos => {
        this.pagos = pagos;
        this.aplicarFiltro();
        console.log('Pagos cargados:', this.pagos);
        this.cargando = false;
      },
      error: err => {
        console.error('Error al obtener mis pagos:', err);
        this.error = 'No se pudieron cargar los pagos.';
        this.cargando = false;
      }
    });
  }
  aplicarFiltro(): void {
    const filtro = this.filtroMotivo.toLowerCase().trim();
    if (filtro === '') {
      this.pagosFiltrados = [...this.pagos];
    } else {
      this.pagosFiltrados = this.pagos.filter(p =>
        p.motivo.toLowerCase().includes(filtro)
      );
    }
  }
  eliminarPago(idPago: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el pago de forma permanente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      this.pagoService.eliminarPago(idPago).subscribe({
        next: () => {
          this.pagos = this.pagos.filter(p => p.idPago !== idPago);
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Pago eliminado exitosamente.',
            timer: 2000,
            showConfirmButton: false,
          });
          this.cargarPagos();
        },
        error: (err) => {
          console.error('Error al eliminar el pago:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.message || err.message || 'Error al intentar eliminar el pago.',
          });
        }
      });
    }
  });
}
}
