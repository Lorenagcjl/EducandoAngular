import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../../services/pago.service';
import { Rubro } from '../../models/rubro.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rubros-integrante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rubros-integrante.component.html',
  styleUrls: ['./rubros-integrante.component.css'],
})
export class RubrosIntegranteComponent implements OnInit {
  rubros: Rubro[] = [];
  rubroSeleccionado: Rubro | null = null;
  archivoSeleccionado: File | null = null;
  archivoInvalido: boolean = false;
  mensajeArchivoInvalido: string = '';

formulario = {
    motivo: '',
    metodoPago: '',
    numeroComprobante: '',
    fechaTransaccion: ''
  };
  constructor(private pagosService: PagoService) {}

  ngOnInit(): void {
    this.obtenerRubros();
  }

  obtenerRubros(): void {
  this.pagosService.obtenerRubros().subscribe({
    next: rubros => {
      console.log('Rubros recibidos:', rubros);
      this.rubros = rubros;
    },
    error: error => console.error('Error al obtener rubros:', error)
  });
}


  abrirModal(rubro: Rubro): void {
    this.rubroSeleccionado = rubro;
  }

  cerrarModal(): void {
  this.rubroSeleccionado = null;
  this.archivoSeleccionado = null;
  this.archivoInvalido = false;
  this.mensajeArchivoInvalido = '';
  this.formulario = {
    motivo: '',
    metodoPago: '',
    numeroComprobante: '',
    fechaTransaccion: ''
  };
}


  onArchivoSeleccionado(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const esPDF = file.type === 'application/pdf';
    const esMenor5MB = file.size <= 5 * 1024 * 1024;

    if (!esPDF) {
      this.archivoInvalido = true;
      this.mensajeArchivoInvalido = 'El archivo debe estar en formato PDF.';
      this.archivoSeleccionado = null;
      return;
    }

    if (!esMenor5MB) {
      this.archivoInvalido = true;
      this.mensajeArchivoInvalido = 'El archivo no debe superar los 5MB.';
      this.archivoSeleccionado = null;
      return;
    }

    this.archivoInvalido = false;
    this.mensajeArchivoInvalido = '';
    this.archivoSeleccionado = file;
  }
}

  pagar(form: any): void {
  this.archivoInvalido = !this.archivoSeleccionado;

  if (!form.valid || this.archivoInvalido) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos obligatorios.',
    });
    Object.values(form.controls).forEach((control: any) => control.markAsTouched());
    return;
  } 

  const formData = new FormData();

  formData.append('cuenta', this.rubroSeleccionado!.cuenta?.toUpperCase() || '');
  formData.append('motivo', this.formulario.motivo?.toUpperCase() || '');
  formData.append('metodoPago', this.formulario.metodoPago?.toUpperCase() || '');
  formData.append('valor', this.rubroSeleccionado!.monto.toString());
  formData.append('numeroComprobante', this.formulario.numeroComprobante?.toUpperCase() || '');
  formData.append('fechaTransaccion', this.formulario.fechaTransaccion);
  formData.append('imagenComprobante', this.archivoSeleccionado!);
  formData.append('idRubro', this.rubroSeleccionado!.idRubro.toString());

  this.pagosService.crearPago(formData).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Pago enviado con éxito',
        showConfirmButton: false,
        timer: 2000,
      });
      this.cerrarModal();
      this.obtenerRubros();
    },
    error: error => {
      console.error('Error al realizar el pago:', error);
      Swal.fire({ 
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al procesar el pago.',
      });
    }
  });
}
quitarArchivo(): void {
  this.archivoSeleccionado = undefined!;
  (document.getElementById('archivo') as HTMLInputElement).value = '';
  this.archivoInvalido = true;
  this.mensajeArchivoInvalido = 'Debes seleccionar un archivo PDF válido.';
}
get totalGeneral(): number {
  return this.rubros
    .filter(r => r.estado !== 'Pagado') // o r.estado === 'Pendiente'
    .reduce((suma, r) => suma + r.totalPagar, 0);
}
}