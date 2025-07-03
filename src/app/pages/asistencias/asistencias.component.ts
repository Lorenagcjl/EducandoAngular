import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AsistenciasService } from '../../services/asistencia.service';
import { Integrante, Asistencia, Evento } from '../../models/asistencia.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asistencias',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './asistencias.component.html',
  styleUrls: ['./asistencias.component.css']
})
export class AsistenciasComponent implements OnInit {
  integrantes: Integrante[] = [];
  asistenciasMap: { [key: number]: string } = {};
  eventos: Evento[] = [];
  eventoSeleccionado: number | null = null;
  idGrupo = 1; // dinámico según el instructor logueado
  bloquearAsistenciaPorFecha: boolean = false;
  asistenciaPermitida: boolean = false;
  porcentajeAsistencia: number | null = null;
anioSeleccionado: number = new Date().getFullYear();
mesSeleccionado: number = new Date().getMonth() + 1;
  constructor(private asistenciasService: AsistenciasService) {}

  ngOnInit(): void {
    this.cargarEventos();
    this.cargarIntegrantes();
    this.cargarPorcentajeAsistencia(this.anioSeleccionado, this.mesSeleccionado);
  }

  cargarEventos() {
    this.asistenciasService.getEventos().subscribe({
  next: (data) => {
    this.eventos = data; //sin filtrar por estado
  },
  error: (err) => {
    console.error('Error al obtener eventos', err);
  }
});
  }

  cargarIntegrantes() {
  if (!this.eventoSeleccionado) return;

  this.asistenciasService.getIntegrantesConAsistencia(this.eventoSeleccionado).subscribe(data => {
    this.integrantes = data;
  });
}
cargarAsistencias() {
  console.log("🚀 cargarAsistencias() fue llamado");
  console.log("Evento seleccionado:", this.eventoSeleccionado);

  const evento = this.eventos.find(e => e.idEvento === this.eventoSeleccionado);

  if (evento) {
    const fechaEvento = new Date(`${evento.fechaEvento}T00:00:00-05:00`);
    const hoy = new Date();

    const mismaFecha = hoy >= fechaEvento;
    const mismoMes = hoy.getMonth() === fechaEvento.getMonth() && hoy.getFullYear() === fechaEvento.getFullYear();

    this.asistenciaPermitida = mismaFecha && mismoMes;

    console.log("📅 Fecha del evento:", fechaEvento.toISOString());
    console.log("📅 Hoy:", hoy.toISOString());
    console.log("✅ ¿Permitir asistencia?", this.asistenciaPermitida);
  } else {
    this.asistenciaPermitida = false;
  }

  this.cargarIntegrantes();

  if (this.eventoSeleccionado != null) {
    this.asistenciasService.getAsistenciasPorEvento(this.eventoSeleccionado).subscribe(data => {
      this.asistenciasMap = {};
      data.forEach(a => {
        this.asistenciasMap[a.idUsuario] = a.estadoAsistencia || '';
      });
    });
  }
}

  guardarAsistencias() {
  if (!this.eventoSeleccionado) return;

  const asistenciasArray = this.integrantes.map(u => ({
    idUsuario: u.idUsuario,
    estadoAsistencia: this.asistenciasMap[u.idUsuario] || ''
  }));

  this.asistenciasService.actualizarAsistencias({
    idEvento: this.eventoSeleccionado,
    asistencias: asistenciasArray
  }).subscribe({
    next: res => {
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: res.mensaje || 'Asistencias guardadas correctamente',
        confirmButtonColor: '#3085d6'
      });
    },
    error: err => {
      console.error('Error al guardar asistencias:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.error?.mensaje || 'Error al guardar asistencias',
        confirmButtonColor: '#d33'
      });
    }
  });
}
  cargarPorcentajeAsistencia(anio: number, mes: number) {
  this.asistenciasService.getPorcentajeAsistencia(this.idGrupo, anio, mes).subscribe({
    next: (porcentaje) => {
      this.porcentajeAsistencia = porcentaje;
    },
    error: (err) => {
      console.error('Error al obtener porcentaje de asistencia', err);
    }
  });
}
}
