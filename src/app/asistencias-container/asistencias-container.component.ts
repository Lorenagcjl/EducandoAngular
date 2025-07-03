import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciasComponent } from '../pages/asistencias/asistencias.component';
import { ResumenAsistenciasComponent } from '../pages/resumen-asistencias/resumen-asistencias.component';
import { IntegrantesComponent } from '../pages/integrantes/integrantes/integrantes.component';

@Component({
  selector: 'app-asistencias-container',
  standalone: true, 
  imports: [CommonModule, IntegrantesComponent, AsistenciasComponent, ResumenAsistenciasComponent],
  templateUrl: './asistencias-container.component.html',
  styleUrls: ['./asistencias-container.component.css']
})
export class AsistenciasContainerComponent {
  tabActiva: 'integrantes' | 'tomar' | 'resumen' = 'integrantes';

  ngOnInit() {
  console.log('ResumenAsistenciasComponent cargado');
}

}
