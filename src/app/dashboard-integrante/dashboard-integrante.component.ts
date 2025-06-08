import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard-integrante',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-integrante.component.html',
  styleUrls: ['./dashboard-integrante.component.css']
})
export class DashboardIntegranteComponent implements OnInit{
nombreUsuario = 'Integrante';  // valor por defecto
  fotoPerfil: string | null = null;  // podrías poner una url default si quieres
  notificacionesCount = 0;
  sidebarCollapsed = false;

  menuItems = [
    { label: 'Eventos', icon: 'fas fa-fw fa-calendar-alt', route: 'eventos' },
    { label: 'Asistencias', icon: 'fas fa-fw fa-school', route: 'asistencias' },
    { label: 'Pagos', icon: 'fas fa-fw fa-file-alt', route: 'pagos' },
    { label: 'Solicitudes', icon: 'fas fa-fw fa-school', route: 'solicitudes' },
    { label: 'Documentos', icon: 'fas fa-fw fa-file-alt', route: 'documentos' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

   ngOnInit(): void {
    // Intentamos extraer info del token decodificado
    const token = this.authService.getToken();
    if (token) {
      const payload = this.decodeToken(token);
      this.nombreUsuario = payload?.nombreCompleto || 'Integrante';
      this.fotoPerfil = payload?.fotoPerfilUrl || null;
      this.notificacionesCount = 0; // Aquí puedes llamar a un método real para obtener notificaciones si existe
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
    this.router.navigate(['/login']);
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
}
 