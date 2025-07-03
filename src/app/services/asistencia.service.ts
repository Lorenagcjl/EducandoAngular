import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Integrante, Asistencia, Evento, AsistenciaResumenDTO } from '../models/asistencia.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AsistenciasService {
  private baseUrl = 'https://localhost:7296/api';
   private apiUrl = 'https://localhost:7296/api/Evento';

  constructor(private http: HttpClient) {}

  getIntegrantes() {
  const baseUrl = 'https://localhost:7296';
  return this.http.get<Integrante[]>(`${this.baseUrl}/Asistencias/integrantes`).pipe(
    map(integrantes => integrantes.map(i => ({
      ...i,
      foto: i.foto ? baseUrl + i.foto : ''
    })))
  );
}

getIntegrantesConAsistencia(idEvento: number) {
  const baseUrl = 'https://localhost:7296'; 
  return this.http.get<Integrante[]>(`${this.baseUrl}/Asistencias/integrantes-con-asistencia`, {
    params: {
      idEvento: idEvento.toString()
    }
  }).pipe(
    map(integrantes => integrantes.map(i => ({
      ...i,
      foto: i.foto ? baseUrl + i.foto : ''
    })))
  );
}

  getAsistenciasPorEvento(idEvento: number): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(`${this.baseUrl}/Asistencias/por-evento/${idEvento}`);
  }

  actualizarAsistencias(data: { idEvento: number; asistencias: { idUsuario: number; estadoAsistencia: string }[] }): Observable<any> {
    return this.http.post(`${this.baseUrl}/Asistencias/actualizar-por-evento`, data);
  }
  marcarAsistenciaIndividual(dto: { idEvento: number, idUsuario: number, estadoAsistencia: string }) {
  return this.http.put<void>(`${this.baseUrl}/Asistencias/marcar`, dto);
}


  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/todos`); 
  }

  getResumenAsistencias() {
  return this.http.get<AsistenciaResumenDTO[]>(`${this.baseUrl}/Asistencias/resumen-asistencias`);
}

 getResumenPorUsuario(idUsuario: number) {
  return this.http.get<AsistenciaResumenDTO[]>(`${this.baseUrl}/Asistencias/resumen`);
}

  getPorcentajeAsistencia(idGrupo: number, anio: number, mes: number) {
  return this.http.get<number>(`${this.baseUrl}/Asistencias/porcentaje-asistencia/${idGrupo}/${anio}/${mes}`);
}
generarPDF(filtros: { resumen: any[]; mesNombre: string; anio: string }) {
  return this.http.post(`${this.baseUrl}/Asistencias/GenerarPDF`, filtros, {
    responseType: 'blob'
  });
}
}
