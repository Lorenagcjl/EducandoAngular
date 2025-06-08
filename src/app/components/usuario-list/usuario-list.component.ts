import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioReadDTO, UsuarioCreateDTO, UsuarioUpdateDTO } from '../../models/usuario.model.';
import { HttpClientModule } from '@angular/common/http';
import { SolicitudesRegistroService } from '../../services/solicitudes-registro.service';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css'],
})
export class UsuarioListComponent implements OnInit {

  usuarios: UsuarioReadDTO[] = [];
  cargando = false;
  error = '';
  mensaje = '';

  roles = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Instructor' },
    { id: 3, nombre: 'Integrante' }
  ];

  grupos = [
    { id: 1, nombre: 'Banda' },
    { id: 2, nombre: 'Bastoneras' },
    { id: 4, nombre: 'General' }
  ];

  formCrear!: FormGroup;
  formEditar!: FormGroup;

  mostrarModalCrear = false;
  creando = false;
  errorCrear : string | null = null;
  exitoCrear: string | null = null;

  mostrarModalEditar = false;
  editando = false;
  errorEditar = '';
  exitoEditar = '';

  constructor(
    private usuarioService: UsuarioService,
    private solicitudesRegistroService: SolicitudesRegistroService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.cargarUsuarios();

    this.formCrear = this.fb.group({
      nombres: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/)]],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      idRol: [0, [Validators.required, Validators.min(1)]],
      idGrupo: [0, [Validators.required, Validators.min(1)]],
    });

    this.formEditar = this.fb.group({
      idUsuario: [null],
      nombres: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/)]],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      idRol: [0, [Validators.required, Validators.min(1)]],
      idGrupo: [0, [Validators.required, Validators.min(1)]],
    });
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.getAll().subscribe({
      next: data => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: err => {
        this.error = 'Error cargando usuarios';
        this.cargando = false;
      }
    });
  }

  cambiarEstado(usuario: UsuarioReadDTO) {
    this.usuarioService.cambiarEstado(usuario.idUsuario).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => alert('No se pudo cambiar el estado del usuario.')
    });
  }

  abrirModalCrear() {
    this.mostrarModalCrear = true;
    this.errorCrear = '';
    this.exitoCrear = '';
    this.formCrear.reset({
      nombres: '',
      apellidos: '',
      cedula: '',
      telefono: '',
      correo: '',
      idRol: 0,
      idGrupo: 0
    });
  }

  cerrarModalCrear() {
    this.mostrarModalCrear = false;
  }

  crearUsuario() {
    if (this.formCrear.invalid) {
      this.formCrear.markAllAsTouched();
      return;
    }

    this.creando = true;
    const dto: UsuarioCreateDTO = this.formCrear.value;

    this.solicitudesRegistroService.registrarUsuario(dto).subscribe({
      next: () => {
        this.creando = false;
      this.errorCrear = null;  // limpiar error si hubo antes
      this.exitoCrear = 'Se ha enviado un correo para activar la cuenta.';
      this.cargarUsuarios();
      // Aquí NO cerramos modal automáticamente para que el usuario vea el mensaje
      // Si quieres cerrarlo después de X segundos, podemos hacerlo:
      setTimeout(() => {
        this.cerrarModalCrear();
        this.exitoCrear = null; // limpiar mensaje
      }, 3000); // 3 segundos
    },
    error: (err) => {
      this.creando = false;
      this.exitoCrear = null; // limpiar éxito si hubo antes
      this.errorCrear = 'Error al registrar: ' + (err.error?.mensaje || err.message || 'Error desconocido');
    }
    });
  }

  abrirModalEditar(usuario: UsuarioReadDTO) {
    this.mostrarModalEditar = true;
  this.errorEditar = '';
  this.exitoEditar = '';

  // Convertimos los nombres de rol/grupo a sus respectivos IDs
  const idRol = this.getIdRol(usuario.rol);
  const idGrupo = this.getIdGrupo(usuario.grupo);

  // Llenamos el formulario con los datos correctos
  this.formEditar.reset({
    idUsuario: usuario.idUsuario,
    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
    cedula: usuario.cedula,
    telefono: usuario.telefono,
    correo: usuario.correo,
    idRol: idRol,
    idGrupo: idGrupo

    });
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
  }

  editarUsuario() {
    if (this.formEditar.invalid) {
      this.formEditar.markAllAsTouched();
      return;
    }

    this.editando = true;
    const dto: UsuarioUpdateDTO = this.formEditar.value;

    this.usuarioService.editarUsuario(dto.idUsuario, dto).subscribe({
      next: () => {
        this.exitoEditar = 'Usuario actualizado correctamente.';
        this.editando = false;
        this.cargarUsuarios();
        setTimeout(() => this.cerrarModalEditar(), 1500);
      },
      error: () => {
        this.errorEditar = 'Error al actualizar usuario.';
        this.editando = false;
      }
    });
  }

  getIdRol(nombre: string): number {
    const rol = this.roles.find(r => r.nombre.toLowerCase() === nombre.toLowerCase());
    return rol?.id || 0;
  }

  getIdGrupo(nombre: string): number {
    const grupo = this.grupos.find(g => g.nombre.toLowerCase() === nombre.toLowerCase());
    return grupo?.id || 0;
  }
}