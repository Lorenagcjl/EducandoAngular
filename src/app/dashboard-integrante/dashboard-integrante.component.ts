import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NotificacionesService } from '../services/notificaciones.service';
import { Subscription, interval } from 'rxjs';
import { HostListener } from '@angular/core';
import { MensajeService } from '../services/mensaje.service';
import { UsuarioService } from '../services/usuario.service';
import { PagoService } from '../services/pago.service';
import Swal from 'sweetalert2'

interface Notificacion {
  idNotificacionUsuario: number;
  titulo: string;
  contenido: string;
  leido: boolean;
  fechaNotificacion: string;
}  
@Component({
  selector: 'app-dashboard-integrante',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-integrante.component.html',
  styleUrls: ['./dashboard-integrante.component.css']
})
export class DashboardIntegranteComponent implements OnInit, OnDestroy{
nombreUsuario = 'Integrante';  // valor por defecto
  fotoPerfil: string | null = null;  // podrías poner una url default si quieres
  notificacionesCount = 0;
  notificaciones: Notificacion[] = [];
mostrarDropdown = false;
  sidebarCollapsed = false;
  private subscripcionConteoNotificaciones?: Subscription;
  private subscripcionCantidadNoLeidos?: Subscription;
   private subscripcionRouter?: Subscription;
  cantidadNoLeidos = 0;
  rutaPerfil: string = '/integrante/perfil';
  mostrarCarrusel = false;

  menuItems = [
    { label: 'Eventos', icon: 'fas fa-fw fa-calendar-alt', route: 'eventos' },
    { label: 'Asistencias', icon: 'fas fa-fw fa-user-check', route: 'asistencias' },
    { label: 'Pagos', icon: 'fas fa-fw fa-coins', route: 'pagos' },
    { label: 'Solicitudes', icon: 'fas fa-fw fa-envelope-open-text', route: 'solicitudes' },
    { label: 'Documentos', icon: 'fas fa-fw fa-file-alt', route: 'documentos' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificacionesService: NotificacionesService,
    private mensajeService: MensajeService,
    private usuarioService: UsuarioService,
    private pagosService: PagoService
  ) {}

   ngOnInit(): void {
    // Intentamos extraer info del token decodificado
    const token = this.authService.getToken();
    if (token) {
      const payload = this.decodeToken(token);
      this.nombreUsuario = payload?.nombreCompleto || 'Integrante';
      this.fotoPerfil = payload?.fotoPerfilUrl || null;
      }
      this.cargarConteoNotificaciones();
      // Obtener perfil real desde backend
    this.usuarioService.perfil$.subscribe(perfil => {
  if (perfil) {
    this.nombreUsuario = `${perfil.nombres || ''} ${perfil.apellidos || ''}`.trim();
    this.fotoPerfil = perfil.foto || null;
    this.checkDeuda();
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
  this.mostrarCarrusel = this.router.url === '/integrante';

  this.subscripcionRouter = this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.mostrarCarrusel = event.urlAfterRedirects === '/integrante';
    }
  });
  
  }
  checkDeuda(): void {
  this.pagosService.obtenerRubros().subscribe({
    next: rubros => {
      const ahora = new Date();

      // Buscar cualquier rubro activo pendiente y vencido
      const rubroVencido = rubros.find(r =>
        r.estado.toLowerCase() !== 'cancelado' &&
        new Date(r.fechaMaximaPagar) < ahora
      );

      if (rubroVencido) {
        Swal.fire({
          icon: 'warning',
          title: '¡Atención!',
          text: 'Usted tiene una deuda pendiente que ya está vencida. Por favor, realice su pago para visualizar la información.',
          showCancelButton: true,
          confirmButtonText: 'Ir a Pagos',
          cancelButtonText: 'Cerrar',
          allowOutsideClick: false
        }).then(result => {
          if (result.isConfirmed) {
            this.router.navigate(['/integrante/pagos']);
          }
        });
        return;
      }

      console.log('No tiene deuda vencida');
    },
    error: err => {
      console.error('Error al verificar deuda:', err);
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
    ruta = '/integrante/eventos';
  } else if (this.contienePalabraClave(titulo, ['pago'])) {
    ruta = '/integrante/pagos';
  }  else if (this.contienePalabraClave(titulo, ['solicitud'])) {
    ruta = '/integrante/solicitudes';
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
 