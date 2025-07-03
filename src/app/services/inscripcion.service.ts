import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InscripcionService {
  private apiUrl = 'https://localhost:7296/api/Inscripcion'; 

  constructor(private http: HttpClient) {}

  obtenerGrupos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grupos-publicos`);
  }

  crearInscripcion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, data);
  }
}
