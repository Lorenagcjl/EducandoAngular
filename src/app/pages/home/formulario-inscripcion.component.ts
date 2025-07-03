import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { InscripcionService } from '../../services/inscripcion.service';// ⚠️ Asegúrate del path correcto

@Component({
  selector: 'app-formulario-inscripcion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-inscripcion.component.html',
  styleUrls: ['./formulario-inscripcion.component.css']
})
export class FormularioInscripcionComponent implements OnInit {
  form!: FormGroup;
  grupos: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private inscripcionService: InscripcionService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombres: ['', [
    Validators.required,
    Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/)
  ]],
  apellidos: ['', [
    Validators.required,
    Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/)
  ]],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9,10}$/)]],
      idGrupo: [null, Validators.required],
      observaciones: ['',[Validators.required]]
    });

    this.obtenerGrupos();
  }

  obtenerGrupos() {
    this.inscripcionService.obtenerGrupos().subscribe({
      next: res => this.grupos = res,
      error: err => console.error('Error al cargar grupos', err)
    });
  }

  enviar() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const formValue = this.form.value;

  // Convertir a mayúsculas los campos de texto deseados
  const inscripcionAMayusculas = {
    ...formValue,
    nombres: formValue.nombres.toUpperCase(),
    apellidos: formValue.apellidos.toUpperCase()
  };

  this.loading = true;
  this.inscripcionService.crearInscripcion(inscripcionAMayusculas).subscribe({
    next: (res: any) => {
      Swal.fire('Éxito', res.mensaje, 'success');
      this.form.reset();
      this.loading = false;
    },
    error: err => {
      Swal.fire('Error', err.error?.mensaje || 'Ocurrió un error inesperado.', 'error');
      this.loading = false;
    }
  });
}

}
