import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../../services/pago.service';
import { PagoDetalleDTO } from '../../models/pago.model';

@Component({
  selector: 'app-admin-pagos-procesados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pagos-procesados.component.html'
})
export class AdminPagosProcesadosComponent implements OnInit {
  pagos: PagoDetalleDTO[] = [];
  cargando = false;
  error: string | null = null;
meses: { nombre: string; valor: number }[] = [
  { nombre: 'Enero', valor: 1 },
  { nombre: 'Febrero', valor: 2 },
  { nombre: 'Marzo', valor: 3 },
  { nombre: 'Abril', valor: 4 },
  { nombre: 'Mayo', valor: 5 },
  { nombre: 'Junio', valor: 6 },
  { nombre: 'Julio', valor: 7 },
  { nombre: 'Agosto', valor: 8 },
  { nombre: 'Septiembre', valor: 9 },
  { nombre: 'Octubre', valor: 10 },
  { nombre: 'Noviembre', valor: 11 },
  { nombre: 'Diciembre', valor: 12 }
];
  // Filtros
  filtroNombre: string = '';
  filtroGrupo: number | null = null;
  filtroMes: number | null = null;
filtroAnio: number | null = null;


  constructor(private pagoService: PagoService) {}

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos() {
    this.cargando = true;
    this.error = null;
    this.pagoService.getPagosProcesados(this.filtroNombre || undefined, this.filtroGrupo || undefined, this.filtroMes || undefined,
  this.filtroAnio || undefined).subscribe({
      next: (data) => {
        this.pagos = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los pagos procesados.';
        this.cargando = false;
      }
    });
  }

  aplicarFiltro() {
    this.cargarPagos();
  }

  limpiarFiltro() {
    this.filtroNombre = '';
    this.filtroGrupo = null;
    this.filtroMes = null;
  this.filtroAnio = null;
    this.cargarPagos();
  }

  descargarComprobante(id: number) {
    this.pagoService.descargarComprobante(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprobante_pago_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
