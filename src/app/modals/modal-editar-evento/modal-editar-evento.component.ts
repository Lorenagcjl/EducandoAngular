import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Evento } from '../../models/evento.model';
import { EventosService } from '../../services/evento.service';

@Component({
  selector: 'app-modal-editar-evento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-editar-evento.component.html',
  styleUrls: ['./modal-editar-evento.component.css']
})
export class ModalEditarEventoComponent {
  @Input() evento!: Evento; 
  @Output() onGuardar = new EventEmitter<{ datosEvento: any, imagenes: File[] }>();

  imagenesNuevas: File[] = [];
  previewImagenes: string[] = [];
  imagenesGuardadas: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private eventoService: EventosService
  ) {}

 onArchivosSeleccionados(event: any): void {
  const archivos = event.target.files;
  if (!archivos) return;

  const nuevosArchivos = Array.from(archivos) as File[];

  // Agregar los nuevos archivos a los ya existentes
  this.imagenesNuevas = this.imagenesNuevas.concat(nuevosArchivos);

  // Actualizar las vistas previas, limpiamos y generamos todas de nuevo
  this.previewImagenes = [];

  for (let archivo of this.imagenesNuevas) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImagenes.push(e.target.result);
    };
    reader.readAsDataURL(archivo);
  }
}


// Función para eliminar una imagen seleccionada antes de enviar
eliminarImagen(index: number): void {
  this.imagenesNuevas.splice(index, 1);
  this.previewImagenes.splice(index, 1);
}


  subirImagenes(): void {
    if (this.imagenesNuevas.length === 0) return;

    const formData = new FormData();
    formData.append('idEvento', this.evento.idEvento.toString());
    this.imagenesNuevas.forEach(file => formData.append('archivo', file));

    this.eventoService.subirImagen(formData).subscribe({
      next: res => {
        alert('Imágenes subidas correctamente');
        this.imagenesNuevas = [];
        this.previewImagenes = [];
      },
      error: err => {
        console.error(err);
        alert('Error al subir imágenes');
      }
    });
  }

  guardarCambios(): void {
    const datosEvento = {
      idEvento: this.evento.idEvento,
      nombreEvento: this.evento.nombreEvento,
      descripcion: this.evento.descripcion,
      fechaEvento: this.evento.fechaEvento,
      inicioEvento: this.evento.inicioEvento,
      finEvento: this.evento.finEvento,
      lugar: this.evento.lugar,
      maquillaje: this.evento.maquillaje,
      peinado: this.evento.peinado
    };

    this.onGuardar.emit({
      datosEvento,
      imagenes: this.imagenesNuevas
    });
  }
}
