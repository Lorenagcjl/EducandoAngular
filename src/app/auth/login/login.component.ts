// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';
  mostrarContrasena = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  onLogin() {
  console.log('onLogin llamado');
  if (this.loginForm.valid) {
    const { correo, contrasena } = this.loginForm.value;
    console.log('Formulario válido. Enviando datos:', correo, contrasena);

    this.authService.login(correo, contrasena).subscribe({
      next: (response) => {
   console.log('Login exitoso, verificando respuesta...');

  if (response.debeCambiarContrasena) {
    this.router.navigate(['/cambiar-contrasena']);
    return;
  }

  const role = response.role;
  console.log('Rol detectado:', role);

        if (role === 'Administrador') {
          this.router.navigate(['/admin']);
        } else if (role === 'Instructor') {
          this.router.navigate(['/instructor']);
        } else if (role === 'Integrante') {
          this.router.navigate(['/integrante']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: err => {
        const mensaje = err.error?.message || '';
        console.log('Error en login:', mensaje);

        if (mensaje.includes('Debe cambiar su contraseña')) {
          // Redirige si el backend indica que debe cambiarla
          this.router.navigate(['/cambiar-contrasena']);
        } else {
          this.error = mensaje || 'Credenciales incorrectas';
        }
      }
    });
  } else {
    console.log('Formulario inválido:', this.loginForm.errors);
    this.loginForm.markAllAsTouched();
  }
}

}
