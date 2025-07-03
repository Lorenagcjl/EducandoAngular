import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SolicitudesService } from '../../services/solicitud.service';
import { Solicitud } from '../../models/solicitud.model';
import { DocumentoService } from '../../services/documento.service';
import Swal from 'sweetalert2';

declare global {
  interface Window {
    bootstrap: any;
  }
}
declare var bootstrap: any;

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mis-solicitudes.component.html',
  styleUrls:['./mis-solicitudes.component.css']
})
export class MisSolicitudesComponent implements OnInit {
  form: FormGroup;
  archivoSeleccionado!: File;
  solicitudes: Solicitud[] = [];
  tiposDocumento: any[] = [];
archivoInvalido = false;
mensajeArchivoInvalido = '';
modalVisible = false;
  // Referencia al modal (usamos #modalSolicitud en el HTML)
  @ViewChild('modalSolicitud') modalSolicitudRef!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudesService,
    private documentoService: DocumentoService
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      idTipoDocumento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.cargarTiposDocumento();
    // Limpiar formulario y archivo cuando el modal se cierra
  const modal = document.getElementById('modalSolicitud');
  if (modal) {
    modal.addEventListener('hidden.bs.modal', () => {
      this.form.reset();
      this.archivoSeleccionado = undefined!;
    });
  }
  }

  cargarSolicitudes(): void {
    this.solicitudService.obtenerMisSolicitudes().subscribe(data => {
      this.solicitudes = data;
    });
  }

  cargarTiposDocumento(): void {
    this.documentoService.getTiposDocumento().subscribe(data => {
      this.tiposDocumento = data;
    });
  }

  onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const esPermitido = file.type === 'application/pdf'; // Solo PDF
    const esMenor5MB = file.size <= 5 * 1024 * 1024;

    if (!esPermitido) {
      this.archivoInvalido = true;
      this.mensajeArchivoInvalido = 'Solo se permiten archivos PDF.';
      this.archivoSeleccionado = undefined!;
      return;
    }

    if (!esMenor5MB) {
      this.archivoInvalido = true;
      this.mensajeArchivoInvalido = 'El archivo no debe superar los 5MB.';
      this.archivoSeleccionado = undefined!;
      return;
    }

    this.archivoInvalido = false;
    this.mensajeArchivoInvalido = '';
    this.archivoSeleccionado = file;
  }
}

quitarArchivo(): void {
  this.archivoSeleccionado = undefined!;
  (document.getElementById('archivo') as HTMLInputElement).value = '';
  this.archivoInvalido = true;
  this.mensajeArchivoInvalido = 'Debes seleccionar un archivo PDF válido.';
}

  crearSolicitud(): void {
  if (this.form.invalid || !this.archivoSeleccionado) return;

  const { titulo, descripcion, idTipoDocumento } = this.form.value;

  this.solicitudService.crearSolicitud({
    titulo: titulo?.toUpperCase() || '',
    descripcion: descripcion?.toUpperCase() || '',
    archivo: this.archivoSeleccionado,
    idTipoDocumento: +idTipoDocumento
  }).subscribe({
    next: () => {
      Swal.fire('Éxito', 'Solicitud registrada correctamente.', 'success');

      // Cerrar modal de forma consistente
      const modal = document.getElementById('modalSolicitud');
      if (modal) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modal);
        modalInstance.hide();
      }

      this.form.reset();
      this.archivoSeleccionado = undefined!;
      this.cargarSolicitudes();
    },
    error: () => {
      Swal.fire('Error', 'No se pudo registrar la solicitud.', 'error');
    }
  });
}


  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu solicitud.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.solicitudService.eliminarSolicitud(id).subscribe(() => {
          Swal.fire('Eliminado', 'La solicitud fue eliminada.', 'success');
          this.cargarSolicitudes();
        });
      }
    });
  }

  descargar(id: number): void {
    this.solicitudService.descargarArchivo(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `solicitud_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
