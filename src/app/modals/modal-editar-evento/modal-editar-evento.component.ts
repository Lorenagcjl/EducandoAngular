import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Evento } from '../../models/evento.model';

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

  constructor(public activeModal: NgbActiveModal) {}

  onFileChange(event: any): void {
    if (event.target.files) {
      this.imagenesNuevas = Array.from(event.target.files);
    }
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
