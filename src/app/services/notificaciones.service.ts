import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private baseUrl = 'https://localhost:7296/api/Notificaciones';

  constructor(private http: HttpClient) { }

  obtenerNotificaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/mis-notificaciones`);
  }

  obtenerConteoNoLeidas(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/conteo-no-leidas`);
  }

  marcarComoLeido(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/marcar-leido/${id}`, {});
  }

  marcarTodasComoLeidas(): Observable<any> {
    return this.http.put(`${this.baseUrl}/marcar-todas-leidas`, {});
  }
}
