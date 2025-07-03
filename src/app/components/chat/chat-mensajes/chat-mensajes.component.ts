import { Component, Input, OnInit, AfterViewChecked, ElementRef, ViewChild, OnChanges, SimpleChanges, HostListener, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MensajeService } from '../../../services/mensaje.service';
import { MensajeDTO, MensajeCreacionDTO, MensajeEdicionDTO } from '../../../models/mensaje.model';
import { AuthService } from '../../../auth/auth.service';
import { UsuarioReadDTO } from '../../../models/usuario.model.'; // Corregido
import * as signalR from '@microsoft/signalr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat-mensajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-mensajes.component.html',
  styleUrls: ['./chat-mensajes.component.css']
})
export class ChatMensajesComponent implements OnInit, AfterViewChecked, OnChanges {
  @Input() usuario!: UsuarioReadDTO;

  mensajes: MensajeDTO[] = [];
  nuevoMensaje: string = '';
  miId: number = 0;

  editandoMensajeId: number | null = null;
  mensajeEditadoTexto: string = '';
  mensajeSeleccionadoId: number | null = null;

  usuariosMap: Record<number, string> = {};

  private hubConnection?: signalR.HubConnection;
  private debeHacerScroll = false;

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  private readonly baseUrl = 'https://localhost:7296';

  constructor(
    private mensajeService: MensajeService,
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const id = this.authService.getUserId();
    if (!id) return;

    this.miId = +id;
    this.iniciarSignalR();
    this.cargarMensajes();
    this.marcarComoLeidos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuario'] && !changes['usuario'].firstChange) {
      this.resetEstadoYRecargar();
    }
  }

  ngAfterViewChecked(): void {
    if (this.debeHacerScroll) {
      this.scrollAlFinal();
      this.debeHacerScroll = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.chatContainer?.nativeElement && !this.chatContainer.nativeElement.contains(target)) {
      this.mensajeSeleccionadoId = null;
      this.editandoMensajeId = null;
    }
  }

  obtenerFotoUsuario(): string {
    return this.usuariosMap[this.usuario.idUsuario] || '/img/usuario-default.png';
  }

  private resetEstadoYRecargar() {
    this.mensajeSeleccionadoId = null;
    this.editandoMensajeId = null;
    this.nuevoMensaje = '';
    this.cargarMensajes();
  }

  cargarMensajes(): void {
    this.mensajeService.obtenerMisMensajes().subscribe({
      next: data => {
        this.mensajes = data
          .filter(m =>
            (m.idRemitente === this.miId && m.idDestinatario === this.usuario.idUsuario) ||
            (m.idRemitente === this.usuario.idUsuario && m.idDestinatario === this.miId)
          )
          .sort((a, b) => new Date(a.fechaEnvio!).getTime() - new Date(b.fechaEnvio!).getTime());

        // Ajustar URLs absolutas de fotos
        this.mensajes.forEach(m => {
          if (m.remitenteFotoUrl && !m.remitenteFotoUrl.startsWith('http')) {
            m.remitenteFotoUrl = this.baseUrl + m.remitenteFotoUrl;
          }
        });

        // Actualizar mapa de fotos por usuario
        this.usuariosMap = {};
        this.mensajes.forEach(m => {
          if (m.remitenteFotoUrl) {
            this.usuariosMap[m.idRemitente] = m.remitenteFotoUrl;
          }
        });

        this.marcarComoLeidos();
        this.debeHacerScroll = true;
      },
      error: err => console.error('Error al cargar mensajes', err)
    });
  }

  marcarComoLeidos(): void {
    this.mensajeService.marcarComoLeidos(this.usuario.idUsuario).subscribe();
  }

  enviarMensaje(): void {
    const contenido = this.nuevoMensaje.trim();
    if (!contenido) return;

    const mensajeDto: MensajeCreacionDTO = {
      idDestinatario: this.usuario.idUsuario,
      contenido
    };

    this.mensajeService.enviarMensaje(mensajeDto).subscribe({
      next: (mensaje) => {
        this.mensajes.push(mensaje);
        this.nuevoMensaje = '';
        this.debeHacerScroll = true;
      },
      error: err => console.error('Error al enviar mensaje', err)
    });
  }

  esMio(mensaje: MensajeDTO): boolean {
    return mensaje.idRemitente === this.miId;
  }

  puedeEditar(mensaje: MensajeDTO): boolean {
    if (!this.esMio(mensaje)) return false;
    const minutos = (Date.now() - new Date(mensaje.fechaEnvio!).getTime()) / 60000;
    return minutos <= 5;
  }

  comenzarEdicion(mensaje: MensajeDTO): void {
    this.editandoMensajeId = mensaje.idMensaje;
    this.mensajeEditadoTexto = mensaje.contenido || '';
    this.mensajeSeleccionadoId = mensaje.idMensaje;
  }

  cancelarEdicion(): void {
    this.editandoMensajeId = null;
    this.mensajeEditadoTexto = '';
  }

  guardarEdicion(mensaje: MensajeDTO): void {
    const contenido = this.mensajeEditadoTexto.trim();
    if (!contenido) return;

    const editDto: MensajeEdicionDTO = {
      idMensaje: mensaje.idMensaje,
      contenido
    };

    this.mensajeService.editarMensaje(editDto).subscribe({
      next: () => {
        mensaje.contenido = contenido;
        mensaje.fechaEnvio = new Date().toISOString();
        this.cancelarEdicion();
      },
      error: err => console.error('Error al editar mensaje', err)
    });
  }

  eliminarMensaje(id: number): void {
    this.mensajeService.eliminarMensaje(id).subscribe({
      next: () => {
        this.mensajes = this.mensajes.filter(m => m.idMensaje !== id);
      },
      error: err => console.error('Error al eliminar mensaje', err)
    });
  }

  confirmarEliminar(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.eliminarMensaje(id);
      this.mensajeSeleccionadoId = null;

      Swal.fire({
        title: 'Eliminado',
        text: 'El mensaje ha sido eliminado.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

  seleccionarMensaje(mensajeId: number) {
    this.mensajeSeleccionadoId = this.mensajeSeleccionadoId === mensajeId ? null : mensajeId;
  }

  scrollAlFinal(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        try {
          if (this.chatContainer) {
            this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
          }
        } catch (e) {
          console.error('Error haciendo scroll:', e);
        }
      }, 50);
    });
  }

  private iniciarSignalR(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/chathub`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .catch(err => console.error('Error SignalR:', err));

    this.hubConnection.on('RecibirMensaje', (mensaje: MensajeDTO) => {
      if (
        (mensaje.idRemitente === this.usuario.idUsuario && mensaje.idDestinatario === this.miId) ||
        (mensaje.idRemitente === this.miId && mensaje.idDestinatario === this.usuario.idUsuario)
      ) {
        this.mensajes.push(mensaje);
        this.marcarComoLeidos();
        this.debeHacerScroll = true;
      }
    });
  }
}
