import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documento } from '../models/documento.model';

@Injectable({ providedIn: 'root' })
export class DocumentoService {
  private apiUrl = 'https://localhost:7296/api/Documentos';

  constructor(private http: HttpClient) {}

  getDocumentos(): Observable<Documento[]> {
    return this.http.get<Documento[]>(this.apiUrl);
  }

  getDocumentosPorTipo(idTipo: number): Observable<Documento[]> {
    return this.http.get<Documento[]>(`${this.apiUrl}/porTipo/${idTipo}`);
  }
  getTiposDocumento() {
  return this.http.get<{ id: number; nombre: string }[]>(`${this.apiUrl}/tipos`);
}

  crearDocumento(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  descargarDocumento(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/descargar/${id}`, { responseType: 'blob' });
  }
  deleteDocumento(id: number) {
  return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
}

}
