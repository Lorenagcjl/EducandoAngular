import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioReadDTO } from '../../../models/usuario.model.'; // corregido punto final
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-chat-lista-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-lista-usuarios.component.html',
  styleUrls: ['./chat-lista-usuarios.component.css']
})
export class ChatListaUsuariosComponent {
  @Output() usuarioSeleccionado = new EventEmitter<UsuarioReadDTO>();

  usuarios: UsuarioReadDTO[] = [];
  terminoBusqueda: string = '';
  private busquedaSubject = new Subject<string>();

  constructor(private usuarioService: UsuarioService) {
    this.busquedaSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((termino) => {
        this.buscarUsuarios(termino);
      });
  }

  onInputCambio(): void {
    this.busquedaSubject.next(this.terminoBusqueda);
  }

  buscarUsuarios(nombre: string): void {
    if (!nombre.trim()) {
      this.usuarios = [];
      return;
    }

    this.usuarioService.buscarUsuariosPorNombre(nombre).subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error al buscar usuarios', err)
    });
  }

  seleccionar(usuario: UsuarioReadDTO): void {
    this.usuarioSeleccionado.emit(usuario);

    // Limpiar lista de usuarios para que no queden resultados antiguos
    this.usuarios = [];

    // También opcionalmente limpiar el término de búsqueda para que el input quede vacío
    this.terminoBusqueda = '';
  }
}
