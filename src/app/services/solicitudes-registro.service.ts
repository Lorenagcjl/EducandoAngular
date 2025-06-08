import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioCreateDTO } from '../models/usuario.model.';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesRegistroService {

  private apiUrl = 'https://localhost:7296/api/SolicitudRegistro'; // o el puerto que uses en tu backend

  constructor(private http: HttpClient) {}

  registrarUsuario(dto: UsuarioCreateDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, dto);
  }

  activarCuenta(token: string): Observable<any> {
    return this.http.get<{ mensaje: string }>(`${this.apiUrl}/activar?token=${token}`);
  }
}
