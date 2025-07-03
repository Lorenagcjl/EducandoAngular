import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './services/usuario.service';
import { UsuarioPerfil } from './models/usuario-perfil.model';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  standalone: true,
  selector: 'app-perfil-usuario',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrls:['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
 usuario: UsuarioPerfil | null = null;
  telefonoForm: FormGroup;
  fotoFormData!: FormData;
  vistaPreviaFoto: string | ArrayBuffer | null = null;

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder) {
  this.telefonoForm = this.fb.group({
    telefono: ['', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$')
    ]]
  });
}
  ngOnInit(): void {
    this.usuarioService.obtenerPerfil().subscribe(data => {
      this.usuario = data;

      // Actualizo solo el valor sin crear un nuevo FormGroup
      this.telefonoForm.patchValue({
        telefono: this.usuario?.telefono || ''
      });
    });
  }

  onFotoSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotoFormData = new FormData();
      this.fotoFormData.append('foto', file);

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.vistaPreviaFoto = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
actualizarFoto() {
  if (this.fotoFormData) {
    this.usuarioService.actualizarFoto(this.fotoFormData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Foto actualizada',
          text: 'La foto se actualizó correctamente.',
          timer: 1500,
          showConfirmButton: false,
        });

        // 👉 Este paso es clave
        this.usuarioService.obtenerPerfil().subscribe(data => {
          this.usuario = data;
          this.vistaPreviaFoto = null;

          // 👇 Aquí notificas al resto de la app (incluido el navbar)
          this.usuarioService.setPerfil(data);

          const imgElement = document.querySelector('.img-thumbnail');
          if (imgElement) {
            imgElement.classList.add('actualizando');
            setTimeout(() => imgElement.classList.remove('actualizando'), 1500);
          }
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la foto.',
        });
      }
    });
  }
}
actualizarTelefono() {
  if (this.telefonoForm.invalid) {
    Swal.fire({
      icon: 'warning',
      title: 'Teléfono inválido',
      text: 'Por favor, ingresa un teléfono válido de 10 números.',
      timer: 2500,
      showConfirmButton: false,
      timerProgressBar: true,
      position: 'center'
    });
    return;
  }
  
  const nuevoTelefono = this.telefonoForm.value.telefono;
  this.usuarioService.actualizarTelefono({ telefono: nuevoTelefono }).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Teléfono actualizado',
        text: 'El teléfono se actualizó correctamente.',
        timer: 1500,
        showConfirmButton: false,
      });
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el teléfono.'
      });
    }
  });
}
}
