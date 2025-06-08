import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  form: FormGroup;
  token: string = '';
  mensaje = '';
  error = '';
  esCambioConToken = false;
  mostrarNueva = false;
  mostrarConfirmar = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', Validators.required]
    },
    { validators: this.validarCoincidencia }
  );

    // Detecta si viene desde enlace con token
    const urlToken = this.route.snapshot.queryParamMap.get('token');
    if (urlToken) {
      this.token = urlToken;
      this.esCambioConToken = true;
    } else {
      const localToken = this.auth.getToken();
      if (localToken) {
        this.token = localToken;
        this.esCambioConToken = false; 
      }
    }
  }

  toggleMostrarNueva(): void {
    this.mostrarNueva = !this.mostrarNueva;
  }

  toggleMostrarConfirmar(): void {
    this.mostrarConfirmar = !this.mostrarConfirmar;
  }

  onSubmit() {
     if (this.form.invalid) {
    this.error = 'Verifica que las contraseñas coincidan y cumplan con los requisitos.';
    this.mensaje = '';
    this.form.markAllAsTouched();
    return;
  }
      const nuevaContrasena = this.form.value.nuevaContrasena;

      if (this.esCambioConToken) {
        //restablecimiento desde email (token en URL)
        this.auth.cambiarContrasenaPorToken(this.token, nuevaContrasena).subscribe({
          next: () => {
            this.mensaje = 'Contraseña restablecida con éxito. Ahora puedes iniciar sesión.';
            this.error = '';
            setTimeout(() => this.router.navigate(['/login']), 2000);
          },
          error: (err) => {
            this.error = err.error?.message || 'Error al restablecer la contraseña.';
            this.mensaje = '';
          }
        });
      } else {
        //cambio obligatorio tras login
        this.auth.cambiarContrasenaUsuario(nuevaContrasena).subscribe({
          next: (response) => {
            this.mensaje = 'Contraseña cambiada con éxito. Puede iniciar sesion';
            this.error = '';
            localStorage.removeItem('token'); // Forzar nuevo login
            setTimeout(() => this.router.navigate(['/login']), 2000);
          },
          error: (err) => {
            this.error = err.error?.message || 'Error al cambiar la contraseña.';
            this.mensaje = '';
          }
        });
      }
  }

  validarCoincidencia(group: FormGroup) {
  const pass = group.get('nuevaContrasena')?.value;
  const confirm = group.get('confirmarContrasena')?.value;
  return pass === confirm ? null : { noCoincide: true };
}

}
