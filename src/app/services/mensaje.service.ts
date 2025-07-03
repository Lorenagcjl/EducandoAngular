import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO, MensajeCreacionDTO, MensajeEdicionDTO } from '../models/mensaje.model';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private apiUrl = 'https://localhost:7296/api/Mensajes';

  constructor(private http: HttpClient) {}

  enviarMensaje(mensaje: MensajeCreacionDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(this.apiUrl, mensaje);
  }

  obtenerMisMensajes(): Observable<MensajeDTO[]> {
    return this.http.get<MensajeDTO[]>(`${this.apiUrl}/mismensajes`);
  }

  marcarComoLeidos(remitenteId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/marcar-leidos`, remitenteId);
  }

  eliminarMensaje(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  editarMensaje(dto: MensajeEdicionDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/editar`, dto);
  }

  obtenerCantidadNoLeidos(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/no-leidos`);
  }
}
