import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPagosPendientesComponent } from './admin-pagos-pendientes.component';
import { AdminPagosProcesadosComponent } from './admin-pagos-procesados.component';
import { AdminGenerarRubrosComponent } from '../../admin-generar-rubros/admin-generar-rubros.component';
import { AdminReportesPagosComponent } from '../../admin-reportes-pagos/admin-reportes-pagos.component';

@Component({
  selector: 'app-admin-pagos',
  standalone: true,
  imports: [CommonModule, AdminPagosPendientesComponent, AdminPagosProcesadosComponent, AdminGenerarRubrosComponent, AdminReportesPagosComponent],
  templateUrl: './admin-pagos.component.html',
  styleUrls:['./admin-pagos.component.css']
})
export class AdminPagosComponent {
  activeTab: 'pendientes' | 'procesados' | 'generar' |'reporte-grupo' = 'pendientes';
}
