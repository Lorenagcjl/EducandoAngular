// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Router } from '@angular/router'; //se agregó


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7296/api/Auth'; //puerto HTTPS
  private tokenKey = 'token';

  private currentRoleSubject = new BehaviorSubject<string | null>(null);
  currentRole$ = this.currentRoleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    if (token) {
      const role = this.getRoleFromToken(token);
      this.currentRoleSubject.next(role);
    }
  }

  login(correo: string, contrasena: string) {
  return this.http.post<any>(`${this.apiUrl}/login`, { correo, contrasena }).pipe(
    map(response => {
      const token = response.token;
      if (!token) throw new Error('Token no recibido');

      localStorage.setItem(this.tokenKey, token);

      const decoded = this.decodeToken(token);
      const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const debeCambiar = decoded['DebeCambiarContrasena'] === 'True'; // aseguramos boolean

      this.currentRoleSubject.next(role);

      return {
        token,
        role,
        debeCambiarContrasena: debeCambiar
      };
    })
  );
}


  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentRoleSubject.next(null);
    this.router.navigate(['/home']); //se agregó
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return this.currentRoleSubject.value;
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null;
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
  }

  solicitarToken(cedula: string) {
    return this.http.post(`${this.apiUrl}/recuperar`, { cedula });
  }

  cambiarContrasenaPorToken(token: string, nuevaContrasena: string) {
    return this.http.post(`${this.apiUrl}/cambiar-contrasena-por-token`, {
      Token: token,
    NuevaContrasena: nuevaContrasena
    });
  }

  // Cambio de contraseña usuario autenticado, con token en headers
  cambiarContrasenaUsuario(nuevaContrasena: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { nuevaContrasena };

    return this.http.post(`${this.apiUrl}/cambiar-contrasena-usuario`, body, { headers });
  }


  private decodeToken(token: string): any {
    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch {
      return {};
    }
  }

  private getRoleFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }
}
