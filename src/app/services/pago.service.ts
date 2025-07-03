import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rubro } from '../models/rubro.model';
import { Pago, PagoDetalleDTO } from '../models/pago.model';
import { EstadoCuentaDTO, EstadoCuentaIntegranteDTO, EstadoCuentaAgrupadoDTO } from '../models/estado.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
private apiUrl = 'https://localhost:7296/api/Pagos';
private apiurl = 'https://localhost:7296/api/Rubro';
  constructor(private http: HttpClient) {}
  obtenerRubros(): Observable<Rubro[]> {
    return this.http.get<Rubro[]>(`${this.apiurl}/mis-rubros`);
  }

  crearPago(pago: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, pago);
  }

  // pago.service.ts

obtenerMisPagos(): Observable<PagoDetalleDTO[]> {
  return this.http.get<PagoDetalleDTO[]>(`${this.apiUrl}/mis-pagos`);
}


  eliminarPago(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

 getPagosPendientes(nombre?: string, idGrupo?: number): Observable<PagoDetalleDTO[]> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    if (idGrupo) params = params.set('idGrupo', idGrupo.toString());

    return this.http.get<PagoDetalleDTO[]>(`${this.apiUrl}/pendientes`, { params });
  }


 getPagosProcesados(nombre?: string, idGrupo?: number, mes?: number, anio?: number): Observable<PagoDetalleDTO[]> {
  let params = new HttpParams();
  if (nombre) params = params.set('nombre', nombre);
  if (idGrupo) params = params.set('idGrupo', idGrupo.toString());
  if (mes) params = params.set('mes', mes.toString());
  if (anio) params = params.set('anio', anio.toString());

  return this.http.get<PagoDetalleDTO[]>(`${this.apiUrl}/procesados`, { params });
}

procesarPago(idPago: number, aprobar: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/procesar/${idPago}?aprobar=${aprobar}`, null);
  }

descargarComprobante(idPago: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/descargar-comprobante/${idPago}`, {
      responseType: 'blob'
    });
  }
generarRubros(anio: number, mesInicio: number) {
    const params = new HttpParams()
      .set('anio', anio)
      .set('mesInicio', mesInicio);

    return this.http.post(`${this.apiurl}/generar`, null, { params });
  }
  getEstadoCuentaAgrupado(grupo: number, anio: number, meses?: number[], nombre?: string) {
  let params: any = {};
  if (meses && meses.length > 0) {
    params.meses = meses;
  }
  if (nombre) {
    params.nombre = nombre;
  }

  return this.http.get<EstadoCuentaAgrupadoDTO[]>(
    `${this.apiUrl}/estado-cuenta-agrupado/${grupo}/${anio}`,
    { params }
  );
}

getEstadoCuentaUsuario(idUsuario: number, anio: number) {
  return this.http.get<EstadoCuentaDTO[]>(`${this.apiUrl}/estado-cuenta/${idUsuario}/${anio}`);
}
descargarPdfUsuario(idUsuario: number, anio: number) {
  return this.http.get(`${this.apiUrl}/descargar-pdf/${idUsuario}/${anio}`, { 
    responseType: 'blob',
  observe: 'response' 
});
}
descargarPdfGrupo(grupo: number, anio: number, meses?: number[], nombre?: string) {
  let params: any = {};
  if (meses && meses.length > 0) {
    params.meses = meses;
  }
  if (nombre) {
    params.nombre = nombre;
  }

  return this.http.get(`${this.apiUrl}/reporte-pdf/${grupo}/${anio}`, {
    params,
    responseType: 'blob'
  });
}


}
