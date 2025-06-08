import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Evento } from '../../models/evento.model';

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

  constructor(public activeModal: NgbActiveModal) {}

  editar(): void {
    this.onEditar.emit();
    this.activeModal.close();
  }

  eliminar(): void {
    this.onEliminar.emit();
    this.activeModal.close();
  }

  obtenerUrlImagen(archivo: string): string {
    // Reemplaza esta URL base por la correcta en tu API
    return `https://localhost:7296/api/Evento/ver-imagen-nombre/${archivo}`;
  }
}
