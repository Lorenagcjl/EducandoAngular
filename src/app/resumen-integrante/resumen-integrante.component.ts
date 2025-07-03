import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciasService } from '../services/asistencia.service';
import { AsistenciaResumenDTO } from '../models/asistencia.model';

@Component({
  selector: 'app-resumen-integrante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resumen-integrante.component.html',
  styleUrls: ['./resumen-integrante.component.css']
})
export class ResumenIntegranteComponent implements OnInit {
  asistencias: AsistenciaResumenDTO[] = [];
  eventos: { idEvento: number; nombreEvento: string; fechaEvento: string }[] = [];
  eventosFiltrados: { idEvento: number; nombreEvento: string; fechaEvento: string }[] = [];

  idUsuario = 123; // por defecto
  estadosPorEvento = new Map<number, string>();

  mesesDisponibles: { nombre: string; anio: number; mes: number }[] = [];
  mesSeleccionado: { nombre: string; anio: number; mes: number } | null = null;
  porcentajeMensual: number | null = null;

  constructor(private asistenciasService: AsistenciasService) {}

  ngOnInit(): void {
    this.cargarAsistencias();
  }

  cargarAsistencias() {
    this.asistenciasService.getResumenPorUsuario(this.idUsuario).subscribe(data => {
      this.asistencias = data;

      const eventosMap = new Map<number, { nombreEvento: string; fechaEvento: string }>();
      this.estadosPorEvento.clear();

      data.forEach(a => {
        eventosMap.set(a.idEvento, {
          nombreEvento: a.nombreEvento,
          fechaEvento: a.fechaEvento
        });
        this.estadosPorEvento.set(a.idEvento, a.estadoAsistencia);
      });

      this.eventos = Array.from(eventosMap.entries())
        .map(([idEvento, ev]) => ({ idEvento, ...ev }))
        .sort((a, b) => new Date(a.fechaEvento).getTime() - new Date(b.fechaEvento).getTime());

      this.generarMesesDisponibles();
    });
  }

  generarMesesDisponibles() {
  const mesesSet = new Set<string>();

  this.mesesDisponibles = this.asistencias.map(a => {
    const fecha = new Date(a.fechaEvento);
    const clave = `${fecha.getFullYear()}-${fecha.getMonth()}`;
    if (mesesSet.has(clave)) return null;
    mesesSet.add(clave);

    const nombre = fecha.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    return { nombre, anio: fecha.getFullYear(), mes: fecha.getMonth() };
  }).filter(Boolean) as { nombre: string; anio: number; mes: number }[];

  // Selecciona el mes actual por defecto si existe
  const ahora = new Date();
  this.mesSeleccionado = this.mesesDisponibles.find(m => m.anio === ahora.getFullYear() && m.mes === ahora.getMonth()) 
    ?? null;

  this.calcularPorcentajeMensual();
}

  calcularPorcentajeMensual() {
    if (!this.mesSeleccionado) {
      this.porcentajeMensual = null;
      this.eventosFiltrados = [];
      return;
    }

    const { anio, mes } = this.mesSeleccionado;

    const inicioMes = new Date(anio, mes, 1);
    const finMes = new Date(anio, mes + 1, 0, 23, 59, 59, 999);

    const eventosMes = this.asistencias.filter(a => {
      const fecha = new Date(a.fechaEvento);
      return fecha >= inicioMes && fecha <= finMes;
    });

    const asistenciasValidas = eventosMes.filter(a =>
      ['Presente', 'Justificado'].includes((a.estadoAsistencia || '').trim())
    ).length;

    this.porcentajeMensual = eventosMes.length > 0
      ? Math.round((asistenciasValidas / eventosMes.length) * 100)
      : 0;

    // Cargar eventos filtrados para mostrar en la tabla
    const eventosIdSet = new Set(eventosMes.map(a => a.idEvento));
    this.eventosFiltrados = this.eventos.filter(e => eventosIdSet.has(e.idEvento));
  }

  getEstado(idEvento: number): string | null {
    return this.estadosPorEvento.get(idEvento) ?? null;
  }

  normalizeEstado(estado: string | null | undefined): string {
    return estado ? estado.toLowerCase() : '';
  }

  obtenerTextoEstado(estado: string | null | undefined): string {
    const e = this.normalizeEstado(estado);
    switch (e) {
      case 'presente': return 'Presente';
      case 'ausente': return 'Ausente';
      case 'justificado': return 'Justificado';
      default: return 'No Registrado';
    }
  }
}
