import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PeriodoInscripcion {
  idPeriodo?: number;  // Opcional, solo para consultas o edición
  nombrePeriodo: string;
  fechaInicio: string; // ISO string (e.g. '2025-06-10T00:00:00')
  fechaFin: string;
  estado?: boolean; // Opcional, viene del backend
}

@Injectable({
  providedIn: 'root'
})
export class PeriodoInscripcionService {

  private apiUrl = 'https://localhost:7296/api/PeriodoInscripcion';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<PeriodoInscripcion[]> {
    return this.http.get<PeriodoInscripcion[]>(this.apiUrl);
  }

  crear(dto: PeriodoInscripcion): Observable<PeriodoInscripcion> {
    return this.http.post<PeriodoInscripcion>(this.apiUrl, dto);
  }

  activar(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/activar/${id}`, {});
  }
}
