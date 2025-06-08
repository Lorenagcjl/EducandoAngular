// reset-request.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-request.component.html',
  styleUrls: ['./reset-request.component.css']
})
export class ResetRequestComponent {
  form: FormGroup;
  mensaje = '';
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }
 
  onSubmit() {
    if (this.form.invalid) {
      this.error = 'Debe ingresar su número de cédula, 10 dígitos.';
      this.mensaje = '';
      this.form.markAllAsTouched();
      return;
    }
      this.auth.solicitarToken(this.form.value.cedula).subscribe({
        next: () => {
          this.mensaje = 'Se ha enviado un token al correo registrado.';
          this.error = '';
        },
        error: (err) => {
          this.error = err.error?.message || 'Error al solicitar restablecimiento.';
          this.mensaje = '';
        }
      });
  }
}
