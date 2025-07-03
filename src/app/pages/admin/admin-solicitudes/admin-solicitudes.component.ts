import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesPendientesComponent } from '../solicitudes-pendientes/solicitudes-pendientes.component';
import { SolicitudesProcesadasComponent } from '../solicitudes-procesadas/solicitudes-procesadas.component';

@Component({
  selector: 'app-admin-solicitudes',
  standalone: true,
  imports: [CommonModule, SolicitudesPendientesComponent, SolicitudesProcesadasComponent],
  templateUrl: './admin-solicitudes.component.html',
  styleUrls:['./admin-solicitudes.component.css']
})
export class AdminSolicitudesComponent {
  activeTab: 'pendientes' | 'procesadas' = 'pendientes';

  cambiarTab(tab: 'pendientes' | 'procesadas') {
    this.activeTab = tab;
  }
}
