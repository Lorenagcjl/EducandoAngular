import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioReadDTO, UsuarioCreateDTO, UsuarioUpdateDTO } from '../models/usuario.model.';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'https://localhost:7296/api/Usuarios'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<UsuarioReadDTO[]> {
    return this.http.get<UsuarioReadDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<UsuarioReadDTO> {
    return this.http.get<UsuarioReadDTO>(`${this.apiUrl}/${id}`);
  }

  crearUsuario(usuario: UsuarioCreateDTO): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  editarUsuario(id: number, usuario: UsuarioUpdateDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, usuario);
  }

  cambiarEstado(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/estado/${id}`, {});
  }
}
