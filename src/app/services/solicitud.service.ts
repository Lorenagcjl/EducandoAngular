import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Solicitud } from '../models/solicitud.model';
import { SolicitudListado } from '../models/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private baseUrl = 'https://localhost:7296/api/Solicitudes';

  constructor(private http: HttpClient) {}

  // Obtener mis solicitudes (Integrante/Instructor)
  obtenerMisSolicitudes(estado?: string): Observable<Solicitud[]> {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    return this.http.get<Solicitud[]>(`${this.baseUrl}/mis-solicitudes`, { params });
  }

  // Subir solicitud nueva
  crearSolicitud(form: {
    titulo: string;
    descripcion: string;
    archivo: File;
    idTipoDocumento: number;
  }): Observable<any> {
    const formData = new FormData();
    formData.append('titulo', form.titulo);
    formData.append('descripcion', form.descripcion);
    formData.append('archivo', form.archivo);
    formData.append('idTipoDocumento', form.idTipoDocumento.toString());

    return this.http.post(`${this.baseUrl}/crear`, formData);
  }
  obtenerSolicitudesPendientes(nombre?: string, idGrupo?: number): Observable<SolicitudListado[]> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    if (idGrupo) params = params.set('idGrupo', idGrupo.toString());

    return this.http.get<SolicitudListado[]>(`${this.baseUrl}/pendientes`, { params });
  }

  obtenerSolicitudesProcesadas(nombre?: string, idGrupo?: number): Observable<SolicitudListado[]> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    if (idGrupo) params = params.set('idGrupo', idGrupo.toString());

    return this.http.get<SolicitudListado[]>(`${this.baseUrl}/procesadas`, { params });
  }

  procesarSolicitud(id: number, aprobar: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/procesar/${id}`, null, { params: { aprobar: aprobar.toString() } });
  }
  // Eliminar solicitud (soft delete)
  eliminarSolicitud(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Descargar solicitud PDF
  descargarArchivo(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/descargar-archivo/${id}`, {
      responseType: 'blob'
    });
  }
}
