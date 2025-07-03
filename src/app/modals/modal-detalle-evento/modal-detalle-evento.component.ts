import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Evento } from '../../models/evento.model';
import { EventosService } from '../../services/evento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-detalle-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detalle-evento.component.html',
  styleUrls: ['./modal-detalle-evento.component.css']
})
export class ModalDetalleEventoComponent {
  @Input() evento!: Evento;
  @Output() onEditar = new EventEmitter<void>();
  @Output() onEliminar = new EventEmitter<void>();
  @Input() rolUsuario!: string;

  constructor(
    public activeModal: NgbActiveModal,
    public eventoService: EventosService
  ) {}

  ngOnInit() {
  console.log('Evento recibido:', this.evento);
  console.log('Imagenes del evento:', this.imagenes);
}

  editar(): void {
    this.onEditar.emit();
    this.activeModal.close();
  }

  eliminar(): void {
    this.onEliminar.emit();
    this.activeModal.close();
  }

  get imagenes(): string[] {
  return this.evento?.imagenes ?? [];
}
descargarImagen(nombre: string) {
  this.eventoService.descargarImagen(nombre).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    window.URL.revokeObjectURL(url);
  });
}
get esVencido(): boolean {
  return !this.evento.estado;  // o según la propiedad que defina "vencido"
}
puedeEditar(): boolean {
  return this.rolUsuario === 'Administrador' || this.rolUsuario === 'Instructor';
}

puedeEliminar(): boolean {
  return this.rolUsuario === 'Administrador';
}
eliminarImagen(nombre: string) {
  if (!this.evento) {
    console.error('No hay evento cargado');
    return;
  }

  if (!this.puedeEliminarImagen()) {
    Swal.fire({
      icon: 'warning',
      title: 'Sin permisos',
      text: 'No tienes permisos para eliminar imágenes.',
    });
    return;
  }

  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la imagen permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.eventoService.eliminarImagen(nombre).subscribe({
        next: (mensaje) => {
          Swal.fire({
            icon: 'success',
            title: 'Imagen eliminada',
            text: mensaje,
          });

          if (!this.evento?.imagenes) {
            console.error('El evento no tiene imágenes');
            return;
          }

          const index = this.evento.imagenes.findIndex(img => img.endsWith(nombre));
          if (index !== -1) {
            this.evento.imagenes.splice(index, 1);
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error || 'Error al eliminar la imagen.',
          });
        }
      });
    }
  });
}
obtenerNombre(ruta: string): string {
  return ruta.split('/').pop() ?? ruta;
}
puedeEliminarImagen(): boolean {
  return this.rolUsuario === 'Administrador' || this.rolUsuario === 'Instructor';
}


}
