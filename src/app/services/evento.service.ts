import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class EventosService {
  private apiUrl = 'https://localhost:7296/api/Evento';

  constructor(private http: HttpClient, private authService: AuthService) {}

  obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/todos`);
  }

  obtenerEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`);
  }

  crearEvento(evento: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, evento);
  }

  editarEvento(id: number, evento: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar/${id}`, evento);
  }

  cambiarEstado(id: number, nuevoEstado: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado: nuevoEstado });
  }

  eliminarEvento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  subirImagen(formData: FormData) {
  return this.http.post(`${this.apiUrl}/subir-imagen`, formData);
}
obtenerUrlImagen(nombreArchivo: string): string {
  return `${this.apiUrl}/ver-imagen-nombre/${nombreArchivo}`;
}
descargarImagen(nombre: string): Observable<Blob> {
 const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authService.getToken());
  return this.http.get(`https://localhost:7296/api/Evento/descargar-imagen/${nombre}`, {
    headers,
    responseType: 'blob'
  });
}
eliminarImagen(nombreArchivo: string) {
    const url = `${this.apiUrl}/eliminar-imagen/${nombreArchivo}`;
    return this.http.delete(url, { responseType: 'text' }); // text para recibir mensaje plano
  }

}
