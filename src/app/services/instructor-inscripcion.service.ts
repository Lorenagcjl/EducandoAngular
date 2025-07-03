import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InscripcionDetalleDTO, AprobarInscripcionDTO } from '../models/inscripciones.model';

@Injectable({
  providedIn: 'root'
})
export class InstructorInscripcionService {
private apiUrl = 'https://localhost:7296/api/Inscripcion';
  constructor(private http: HttpClient) { }

  obtenerPendientes(nombre?: string, idGrupo?: number): Observable<InscripcionDetalleDTO[]> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    if (idGrupo) params = params.set('idGrupo', idGrupo.toString());

    return this.http.get<InscripcionDetalleDTO[]>(`${this.apiUrl}/pendientes`, { params });
  }
  obtenerProcesadas(nombre?: string, idGrupo?: number, mes?: number, anio?: number): Observable<InscripcionDetalleDTO[]> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    if (idGrupo) params = params.set('idGrupo', idGrupo.toString());
    if (mes) params = params.set('mes', mes.toString());
    if (anio) params = params.set('anio', anio.toString());

    return this.http.get<InscripcionDetalleDTO[]>(`${this.apiUrl}/procesadas`, { params });
  }

  aprobar(idInscripcion: number): Observable<any> {
    const dto: AprobarInscripcionDTO = { idInscripcion, aprobar: true };
    return this.http.put(`${this.apiUrl}/aprobar`, dto);
  }

  rechazar(idInscripcion: number): Observable<any> {
    const dto: AprobarInscripcionDTO = { idInscripcion, aprobar: false };
    return this.http.put(`${this.apiUrl}/aprobar`, dto);
  }
}
