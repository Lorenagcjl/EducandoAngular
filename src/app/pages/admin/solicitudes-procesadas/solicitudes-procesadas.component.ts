import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SolicitudesService } from '../../../services/solicitud.service';
import { SolicitudListado } from '../../../models/solicitud.model';
import { InscripcionService } from '../../../services/inscripcion.service';

@Component({
  selector: 'app-solicitudes-procesadas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitudes-procesadas.component.html',
})
export class SolicitudesProcesadasComponent implements OnInit {
  solicitudes: SolicitudListado[] = [];
  nombre = '';
  idGrupo: number | null = null;
  grupos: { idGrupo: number; nombreGrupo: string }[] = [];

  constructor(private solicitudService: SolicitudesService, private inscripcionService: InscripcionService) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.cargarGrupos();
  }

  cargarSolicitudes(): void {
    this.solicitudService
      .obtenerSolicitudesProcesadas(
        this.nombre || undefined,
        this.idGrupo !== null ? this.idGrupo : undefined
      )
      .subscribe({
        next: (data) => {
          this.solicitudes = data;
        },
        error: () => {
          Swal.fire('Error', 'No se pudieron cargar las solicitudes procesadas.', 'error');
        }
      });
  }

  cargarGrupos(): void {
    this.inscripcionService.obtenerGrupos().subscribe(data => {
      this.grupos = data;
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

  descargar(id: number): void {
    this.solicitudService.descargarArchivo(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `solicitud_${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo descargar el archivo.', 'error');
      }
    });
  }
}
