import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesService } from '../../../services/solicitud.service';
import { SolicitudListado } from '../../../models/solicitud.model';
import { FormsModule } from '@angular/forms';
import { InscripcionService } from '../../../services/inscripcion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes-pendientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitudes-pendientes.component.html'
})
export class SolicitudesPendientesComponent implements OnInit {
  solicitudes: SolicitudListado[] = [];
  nombre = '';
  idGrupo: number | null = null;
  grupos: { idGrupo: number, nombreGrupo: string }[] = [];

  constructor(private solicitudService: SolicitudesService, private inscripcionService: InscripcionService) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.cargarGrupos();
  }

  cargarSolicitudes(): void {
  this.solicitudService.obtenerSolicitudesPendientes(
    this.nombre || undefined,
    this.idGrupo !== null ? this.idGrupo : undefined
  ).subscribe(data => {
    this.solicitudes = data;
  });
}

  cargarGrupos(): void {
    this.inscripcionService.obtenerGrupos().subscribe(data => {
      this.grupos = data;
    });
  }

  aprobar(id: number): void {
    Swal.fire({
      title: '¿Aprobar solicitud?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.solicitudService.procesarSolicitud(id, true).subscribe(() => {
          Swal.fire('Aprobada', 'La solicitud ha sido aprobada.', 'success');
          this.cargarSolicitudes();
        });
      }
    });
  }

  rechazar(id: number): void {
    Swal.fire({
      title: '¿Rechazar solicitud?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.solicitudService.procesarSolicitud(id, false).subscribe(() => {
          Swal.fire('Rechazada', 'La solicitud ha sido rechazada.', 'info');
          this.cargarSolicitudes();
        });
      }
    });
  }

  aplicarFiltros(): void {
    this.cargarSolicitudes();
  }

  limpiarFiltros(): void {
    this.nombre = '';
    this.idGrupo = null;
    this.cargarSolicitudes();
  }
  descargar(idSolicitud: number, archivo: string): void {
  if (!archivo) {
    Swal.fire('Error', 'No hay archivo para descargar.', 'error');
    return;
  }

  this.solicitudService.descargarArchivo(idSolicitud).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Usamos el nombre del archivo real, si está disponible
      a.download = archivo || `solicitud_${idSolicitud}.pdf`;

      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: () => {
      Swal.fire('Error', 'No se pudo descargar el archivo.', 'error');
    }
  });
}

}
