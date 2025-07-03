import { Component, EventEmitter, Output, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DocumentoService } from '../../services/documento.service';
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-documento-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documento-form.component.html',
  styleUrls:['./documento-form.component.css']
})
export class DocumentoFormComponent implements OnInit {
  @Output() documentoCreado = new EventEmitter<void>();
  @Input() rolUsuario!: string;
archivoInvalido: boolean = false;
mensajeArchivoInvalido: string = '';
archivoSeleccionado: File | null = null;
  documentoService = inject(DocumentoService);

  tiposDocumento: { id: number; nombre: string }[] = [];
  modelo = {
    titulo: '',
    descripcion: '',
    idTipoDocumento: 0,
    archivo: null as File | null,
  };

  modalVisible = false;
  cargando = false;
  errorMensaje = '';

  ngOnInit() {
    this.cargarTipos();
  }

  abrir() {
    this.limpiar();
    this.modalVisible = true;
  }

  cerrar() {
    this.modalVisible = false;
  }

  limpiar() {
    this.modelo = {
      titulo: '',
      descripcion: '',
      idTipoDocumento: 0,
      archivo: null,
    };
    this.errorMensaje = '';
  }

  cargarTipos() {
    this.documentoService.getTiposDocumento().subscribe({
      next: (tipos) => {
        this.tiposDocumento = tipos;
      },
      error: () => {
        this.errorMensaje = 'No se pudo cargar los tipos de documento.';
      },
    });
  }

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const esPDFoDOCX = file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const esMenor5MB = file.size <= 5 * 1024 * 1024;

    if (!esPDFoDOCX) {
      this.archivoInvalido = true;
      this.mensajeArchivoInvalido = 'El archivo debe estar en formato PDF o DOCX.';
      this.modelo.archivo = null;
      return;
    }

    if (!esMenor5MB) {
      this.archivoInvalido = true;
      this.mensajeArchivoInvalido = 'El archivo no debe superar los 5MB.';
      this.modelo.archivo = null;
      return;
    }

    this.archivoInvalido = false;
    this.mensajeArchivoInvalido = '';
    this.modelo.archivo = file;
  }
}
quitarArchivo(): void {
  this.archivoSeleccionado = undefined!;
  (document.getElementById('archivo') as HTMLInputElement).value = '';
  this.archivoInvalido = true;
  this.mensajeArchivoInvalido = 'Debes seleccionar un archivo PDF o DOCX válido.';
}
 

  async submit(form: NgForm) {
  if (form.invalid) {
    this.errorMensaje = 'Por favor completa todos los campos requeridos.';
    return;
  }
  if (!this.modelo.archivo) {
    this.errorMensaje = 'Debes seleccionar un archivo.';
    return;
  }

  this.cargando = true;
  this.errorMensaje = '';
  this.modelo.titulo = this.modelo.titulo?.toUpperCase() || '';
  this.modelo.descripcion = this.modelo.descripcion?.toUpperCase() || '';

  const dto = new FormData();
  dto.append('Titulo', this.modelo.titulo);
  dto.append('Descripcion', this.modelo.descripcion);
  dto.append('IdTipoDocumento', this.modelo.idTipoDocumento.toString());
  dto.append('Archivo', this.modelo.archivo);

  this.documentoService.crearDocumento(dto).subscribe({
  next: res => {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: res.mensaje, // "Documento creado correctamente."
      timer: 2000,
      showConfirmButton: false
    });

    this.documentoCreado.emit();
    this.cerrar();
  },
  error: err => {
    console.error(err);
    this.errorMensaje = 'Error al crear el documento.';

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo guardar el documento.',
    });
  },
  complete: () => {
    this.cargando = false;
  }
});

}

}
