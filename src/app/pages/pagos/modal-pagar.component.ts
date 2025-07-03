import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rubro } from '../../models/rubro.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Pago } from '../../models/pago.model';
import { PagoService } from '../../services/pago.service';

@Component({
  selector: 'app-modal-pagar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-pagar.component.html',
  styleUrls:['./modal-pagar.component.html']
})
export class ModalPagarComponent {
  @Input() rubro!: Rubro;

  pago: Pago = {
    cuenta: '',
    motivo: '',
    metodoPago: '',
    valor: 0,
    numeroComprobante: '',
    fechaTransaccion: '',
    imagenComprobante: {} as File,
    estadoPago: 'Pendiente',
    idRubro: 0
  };

  archivoNombre = '';

  constructor(
    public activeModal: NgbActiveModal,
    private pagoService: PagoService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.pago.imagenComprobante = file;
      this.archivoNombre = file.name;
    }
  }

  pagar() {
    if (!this.pago.imagenComprobante) {
      alert("Debes subir una imagen del comprobante.");
      return;
    }
if (!this.pago.valor || this.pago.valor <= 0) {
  alert("El valor debe ser mayor que 0.");
  return;
}

    this.pago.idRubro = this.rubro.idRubro;

    const formData = new FormData();
    for (const key in this.pago) {
      if (this.pago[key as keyof Pago] !== undefined) {
        formData.append(key, this.pago[key as keyof Pago] as any);
      }
    }

    this.pagoService.crearPago(formData).subscribe({
      next: () => {
        alert("Pago enviado correctamente.");
        this.activeModal.close();
      },
      error: () => {
        alert("Error al enviar el pago.");
      }
    });
  }
}
