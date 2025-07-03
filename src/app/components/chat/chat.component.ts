import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatListaUsuariosComponent } from './chat-lista-usuarios/chat-lista-usuarios.component';
import { ChatMensajesComponent } from './chat-mensajes/chat-mensajes.component';
import { UsuarioReadDTO } from '../../models/usuario.model.';
import { MensajeService } from '../../services/mensaje.service';
import { AuthService } from '../../auth/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ChatListaUsuariosComponent, ChatMensajesComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  usuarioSeleccionado: UsuarioReadDTO | null = null;
  chatsRecientes: UsuarioReadDTO[] = [];
  miId!: number;
  mostrarChatsRecientes: boolean = true;
  private readonly baseUrl = 'https://localhost:7296';

  constructor(
    private mensajeService: MensajeService,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    const id = this.authService.getUserId();
    if (!id) return;
    this.miId = +id;

    this.cargarChatsDesdeMensajes();
    // Actualiza cada 10 segundos 
  setInterval(() => this.cargarChatsDesdeMensajes(), 10000);
  }

  cargarChatsDesdeMensajes() {
  this.mensajeService.obtenerMisMensajes().subscribe({
    next: mensajes => {
      const remitentesSet = new Set<number>();
      mensajes.forEach(m => {
        if (m.idRemitente !== this.miId) {
          remitentesSet.add(m.idRemitente);
        }
      });

      const usuariosId = Array.from(remitentesSet);

      if (usuariosId.length === 0) {
        this.chatsRecientes = [];
        this.usuarioSeleccionado = null;
        return;
      }

      const observables = usuariosId.map(id => this.usuarioService.getById(id));

      forkJoin(observables).subscribe({
        next: usuarios => {
          this.chatsRecientes = usuarios.map(usuario => ({
            ...usuario,
            foto: usuario.foto
              ? (usuario.foto.startsWith('http') ? usuario.foto : `${this.baseUrl}${usuario.foto}`)
              : ''
          }));

          console.log('Usuarios con foto actualizada:', this.chatsRecientes);
        },
        error: err => console.error('Error obteniendo usuarios', err)
      });

    },
    error: err => console.error('Error obteniendo mensajes', err)
  });
}


  seleccionarUsuario(usuario: UsuarioReadDTO) {
    this.abrirChat(usuario);
  }

  abrirChat(usuario: UsuarioReadDTO) {
    const index = this.chatsRecientes.findIndex(u => u.idUsuario === usuario.idUsuario);
    if (index !== -1) {
      this.chatsRecientes.splice(index, 1);
    }
    this.chatsRecientes.unshift(usuario);
    this.usuarioSeleccionado = usuario;
  }

  toggleChatsRecientes() {
    this.mostrarChatsRecientes = !this.mostrarChatsRecientes;
  }

}
