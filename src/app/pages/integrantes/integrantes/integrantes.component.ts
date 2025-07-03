import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciasService } from '../../../services/asistencia.service';
import { Integrante } from '../../../models/asistencia.model';

@Component({
  selector: 'app-integrantes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './integrantes.component.html',
  styleUrls: ['./integrantes.component.css']
})
export class IntegrantesComponent implements OnInit {

  integrantes: Integrante[] = [];
  eventoSeleccionado: number = 0; // O inicializa como necesites
  idGrupo: number = 0; // Puedes obtenerlo de auth o configurarlo como corresponda

  constructor(private asistenciasService: AsistenciasService) {}

  ngOnInit(): void {
    // Inicializa idGrupo y eventoSeleccionado como corresponda en tu app
    this.cargarIntegrantes();
  }

  cargarIntegrantes() {
  this.asistenciasService.getIntegrantes().subscribe(data => {
    this.integrantes = data;
  });
}
}
