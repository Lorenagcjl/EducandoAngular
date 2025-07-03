import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentoService } from '../services/documento.service';
import { Documento } from '../models/documento.model';
import { DocumentoFormComponent } from './documentos/documento-form.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [CommonModule, FormsModule, DocumentoFormComponent],
  templateUrl: './documentos.component.html'
})
export class DocumentosComponent {

  documentos: Documento[] = [];
  tiposDocumento: { id: number; nombre: string }[] = [];
  tipoSeleccionado: number = 0;  // <-- explícito número
  rolUsuario: string = '';

  @ViewChild('modal') modal!: DocumentoFormComponent;

  constructor(
    private documentoService: DocumentoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.rolUsuario = this.authService.getRole() ?? '';
    this.cargarTiposDocumento();
  }

  cargarTiposDocumento() {
    this.documentoService.getTiposDocumento().subscribe(tipos => {
      this.tiposDocumento = tipos;
      this.cargarDocumentos();
    });
  }

  cargarDocumentos() {
    this.documentoService.getDocumentos().subscribe(res => this.documentos = res);
  }

  filtrarPorTipo() {
    // Aquí podemos añadir un console.log para debug
    console.log('Filtrar tipo:', this.tipoSeleccionado, typeof this.tipoSeleccionado);

    if (this.tipoSeleccionado === 0) {
      this.cargarDocumentos();
    } else {
      this.documentoService.getDocumentosPorTipo(this.tipoSeleccionado).subscribe(res => this.documentos = res);
    }
  }

  refrescar() {
    this.tipoSeleccionado = 0;
    this.cargarDocumentos();
  } 

  descargar(id: number) {
    this.documentoService.descargarDocumento(id).subscribe(blob => {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = 'documento';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  abrirModal() {
    this.modal?.abrir();
  }

  confirmarEliminar(idDocumento: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarDocumento(idDocumento);
      } 
    });
  }

  eliminarDocumento(idDocumento: number) {
    this.documentoService.deleteDocumento(idDocumento).subscribe({
      next: () => {
        Swal.fire('Eliminado', 'El documento ha sido eliminado.', 'success');
        this.refrescar();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo eliminar el documento.', 'error');
      }
    });
  }
}
