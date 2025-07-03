import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SolicitudesRegistroService } from '../../services/solicitudes-registro.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-activar-cuenta',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './activar-cuenta.component.html',
  styleUrls: ['./activar-cuenta.component.css'],
})
export class ActivarCuentaComponent implements OnInit {

  mensaje = '';
  error = '';
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private solicitudesRegistroService: SolicitudesRegistroService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.error = 'Token no válido.';
      this.cargando = false;
      return;
    }

    this.solicitudesRegistroService.activarCuenta(token).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Cuenta activada correctamente. Por favor revisa tu correo.';
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al activar cuenta.';
        this.cargando = false;
      }
    });
  }
}
