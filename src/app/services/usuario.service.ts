import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UsuarioReadDTO, UsuarioCreateDTO, UsuarioUpdateDTO } from '../models/usuario.model.';
import { UsuarioPerfil } from '../models/usuario-perfil.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'https://localhost:7296/api/Usuarios'; 
  // BehaviorSubject para compartir el perfil actualizado
  private perfilSubject = new BehaviorSubject<UsuarioPerfil | null>(null);
  perfil$ = this.perfilSubject.asObservable();

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
  buscarUsuariosPorNombre(nombre: string): Observable<UsuarioReadDTO[]> {
    return this.http.get<UsuarioReadDTO[]>(`${this.apiUrl}/buscar?nombre=${nombre}`);
  }
  actualizarFoto(formData: FormData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/foto`, formData).pipe(
      tap(() => {
        // Al actualizar la foto, recarga el perfil y emite el nuevo valor
        this.refrescarPerfil();
      })
    );
  }
obtenerPerfil(): Observable<UsuarioPerfil> {
    const baseUrl = 'https://localhost:7296'; // tu backend URL aquí
    return this.http.get<UsuarioPerfil>(`${this.apiUrl}/perfil`).pipe(
      map(usuario => {
        if (usuario.foto) {
          usuario.foto = baseUrl + usuario.foto;
        }
        return usuario;
      }),
      tap(usuario => this.perfilSubject.next(usuario)) // emitir el perfil al obtenerlo
    );
  }

  actualizarTelefono(data: { telefono: string }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/perfil`, data);
  }
  setPerfil(perfil: UsuarioPerfil): void {
  this.perfilSubject.next(perfil);
}
  // Método para refrescar y emitir el perfil actualizado
  refrescarPerfil() {
    this.obtenerPerfil().subscribe({
      next: perfil => this.perfilSubject.next(perfil),
      error: err => console.error('Error refrescando perfil', err)
    });
  }
}
