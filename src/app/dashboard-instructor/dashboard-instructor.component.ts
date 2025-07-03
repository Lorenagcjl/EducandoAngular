import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NotificacionesService } from '../services/notificaciones.service';
import { Subscription, interval } from 'rxjs';
import { HostListener } from '@angular/core';
import { MensajeService } from '../services/mensaje.service';
import { UsuarioService } from '../services/usuario.service';

interface Notificacion {
  idNotificacionUsuario: number;
  titulo: string;
  contenido: string;
  leido: boolean;
  fechaNotificacion: string;
} 
@Component({
  selector: 'app-dashboard-instructor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-instructor.component.html',
  styleUrls: ['./dashboard-instructor.component.css']
})
export class DashboardInstructorComponent implements OnInit, OnDestroy {
 nombreUsuario = 'Instructor';  // valor por defecto
  fotoPerfil: string | null = null;  // podrías poner una url default si quieres
  notificacionesCount = 0;
  notificaciones: Notificacion[] = [];
mostrarDropdown = false;
  sidebarCollapsed = false;
  private subscripcionConteoNotificaciones?: Subscription;
  private subscripcionCantidadNoLeidos?: Subscription;
   private subscripcionRouter?: Subscription;
  cantidadNoLeidos = 0;
  rutaPerfil: string = '/instructor/perfil';
  mostrarCarrusel = false;

  menuItems = [
    { label: 'Eventos', icon: 'fas fa-fw fa-calendar-alt', route: 'eventos' },
    { label: 'Asistencias', icon: 'fas fa-fw fa-user-check', route: 'asistencias' },
    { label: 'Inscripciones', icon: 'fas fa-fw fa-clipboard-list', route: 'inscripciones' },
    { label: 'Solicitudes', icon: 'fas fa-fw fa-envelope-open-text', route: 'solicitudes' },
    { label: 'Documentos', icon: 'fas fa-fw fa-file-alt', route: 'documentos' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificacionesService: NotificacionesService,
    private mensajeService: MensajeService,
    private usuarioService: UsuarioService
  ) {}

   ngOnInit(): void {
    // Intentamos extraer info del token decodificado
    const token = this.authService.getToken();
    if (token) {
      const payload = this.decodeToken(token);
      this.nombreUsuario = payload?.nombreCompleto || 'Instructor';
      this.fotoPerfil = payload?.fotoPerfilUrl || null;
      }
      this.cargarConteoNotificaciones();
      // Obtener perfil real desde backend
    this.usuarioService.perfil$.subscribe(perfil => {
  if (perfil) {
    this.nombreUsuario = `${perfil.nombres || ''} ${perfil.apellidos || ''}`.trim();
    this.fotoPerfil = perfil.foto || null;
  }
});
this.usuarioService.refrescarPerfil(); // Carga inicial
    // Refrescar cada 30 segundos
    this.subscripcionConteoNotificaciones = interval(30000).subscribe(() => {
      this.cargarConteoNotificaciones();
    });

    this.subscripcionCantidadNoLeidos = interval(30000).subscribe(() => {
      this.cargarCantidadNoLeidos();
    });
    //mostrar carrusel
  this.mostrarCarrusel = this.router.url === '/instructor';

  this.subscripcionRouter = this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.mostrarCarrusel = event.urlAfterRedirects === '/instructor';
    }
  });
  }
  cargarCantidadNoLeidos(): void {
    this.mensajeService.obtenerCantidadNoLeidos().subscribe({
      next: cantidad => this.cantidadNoLeidos = cantidad,
      error: err => console.error('Error al cargar mensajes no leídos', err)
    });
  }
  ngOnDestroy(): void {
      this.subscripcionConteoNotificaciones?.unsubscribe();
    this.subscripcionCantidadNoLeidos?.unsubscribe();
    this.subscripcionRouter?.unsubscribe();
    }
    private cargarConteoNotificaciones(): void {
      this.notificacionesService.obtenerConteoNoLeidas().subscribe({
        next: (count) => {
          console.log('Conteo recibido:', count);
          this.notificacionesCount = count;
        },
        error: (err) => {
          console.error('Error al obtener notificaciones', err);
        }
      });
    }
    toggleDropdown(event: Event) {
      event.stopPropagation();
    this.mostrarDropdown = !this.mostrarDropdown;
  
    if (this.mostrarDropdown) {
      this.cargarNotificaciones(); // Cargar al abrir
    }
  }
  
  cargarNotificaciones(): void {
    this.notificacionesService.obtenerNotificaciones().subscribe({
      next: (data) => {
        console.log('Notificaciones recibidas:', data);  // <-- aquí
        this.notificaciones = data;
      },
      error: (err) => {
        console.error('Error al cargar notificaciones', err);
      }
    });
  }
  marcarTodasComoLeidas(): void {
  this.notificacionesService.marcarTodasComoLeidas().subscribe({
    next: () => {
      this.cargarNotificaciones();
      this.cargarConteoNotificaciones();
    },
    error: err => console.error('Error al marcar todas como leídas', err)
  });
}

  irADetalle(notificacion: Notificacion): void {
    const titulo = notificacion.titulo.toLowerCase();
  
    // Marcar como leída
    this.notificacionesService.marcarComoLeido(notificacion.idNotificacionUsuario).subscribe({
      complete: () => {
        this.cargarConteoNotificaciones(); // Actualiza el badge
      }
    });
  let ruta: string | null = null;
    // Lógica para detectar el módulo destino
  if (this.contienePalabraClave(titulo, ['evento'])) {
    ruta = '/instructor/eventos';
  } else if (this.contienePalabraClave(titulo, ['inscripción'])) {
    ruta = '/instructor/inscripciones';
  } else if (this.contienePalabraClave(titulo, ['solicitud'])) {
    ruta = '/instructor/solicitudes';
  }

  if (ruta) {
    this.router.navigateByUrl(ruta);
  } else {
    alert('No se pudo determinar a qué módulo pertenece esta notificación.');
  }

  this.mostrarDropdown = false;
}

private contienePalabraClave(texto: string, claves: string[]): boolean {
  return claves.some(palabra => texto.includes(palabra));
}
  @HostListener('document:click', ['$event'])
    clickFuera(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = document.getElementById('alertsDropdown');
      if (dropdown && !dropdown.contains(target)) {
        this.mostrarDropdown = false;
      }
    }
  toggleSidebar() {
    const body = document.body;
    body.classList.toggle('sidebar-toggled');
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('toggled');
    }
  }

  logout() {
    this.authService.logout();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private decodeToken(token: string): any {
    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch {
      return {};
    }
  }
  onImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/img/undraw_profile.svg'; // fallback
}
}
