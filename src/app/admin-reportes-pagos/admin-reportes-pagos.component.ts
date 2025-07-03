import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../services/pago.service';
import { EstadoCuentaAgrupadoDTO, EstadoCuentaDTO, EstadoCuentaIntegranteDTO } from '../models/estado.model';

@Component({
  selector: 'app-admin-reportes-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reportes-pagos.component.html',
  styleUrls: ['./admin-reportes-pagos.component.css']
})
export class AdminReportesPagosComponent {
grupoSeleccionado: number = 1;
anioSeleccionado: number = 2025;
mesesSeleccionados: number[] =[];
estadoGrupo: EstadoCuentaAgrupadoDTO[] = [];
verEstadoUsuario: EstadoCuentaDTO[] = [];
usuarioSeleccionado: string = '';
nombreBuscado: string = '';
meses: string[] = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

constructor(private pagoService: PagoService) {}

cargarEstadoGrupo() {
  this.pagoService
    .getEstadoCuentaAgrupado(
      this.grupoSeleccionado,
      this.anioSeleccionado,
      this.mesesSeleccionados.length > 0 ? this.mesesSeleccionados : undefined,
      this.nombreBuscado || undefined
    )
    .subscribe(data => {
      this.estadoGrupo = data;
      this.usuarioSeleccionado = '';
      this.verEstadoUsuario = [];
    });
}


  mostrarDetallesUsuario(usuarioId: number, nombre: string) {
  this.usuarioSeleccionado = nombre;
  this.pagoService.getEstadoCuentaUsuario(usuarioId, this.anioSeleccionado).subscribe({
    next: (data) => {
      console.log('Datos recibidos del backend:', data);
      this.verEstadoUsuario = data;
    },
    error: (err) => {
      console.error('Error al obtener estado de cuenta:', err);
    }
  });
}
isFirstOccurrence(index: number, usuarioId: number): boolean {
  // Verifica si este usuario no apareció antes en el array
  return this.estadoGrupo.findIndex(item => item.idUsuario === usuarioId) === index;
}
descargarEstadoPDF(usuario: EstadoCuentaAgrupadoDTO) {
  this.pagoService.descargarPdfUsuario(usuario.idUsuario, this.anioSeleccionado)
    .subscribe({
      next: (response) => {
        const blob = new Blob([response.body!], { type: 'application/pdf' });

        // Crear URL para el blob
        const url = window.URL.createObjectURL(blob);

        // Crear un enlace oculto
        const a = document.createElement('a');
        a.href = url;
        a.download = `EstadoCuenta_${usuario.nombreCompleto.replace(/ /g, '_')}_${this.anioSeleccionado}.pdf`;
        a.click();

        // Liberar memoria
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar el PDF:', err);
        alert('Ocurrió un error al generar el PDF');
      }
    });
}
descargarPDFGrupo() {
  this.pagoService.descargarPdfGrupo(
    this.grupoSeleccionado,
    this.anioSeleccionado,
    this.mesesSeleccionados.length > 0 ? this.mesesSeleccionados : undefined,
    this.nombreBuscado || undefined
  ).subscribe({
    next: (blob) => {
      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `EstadoCuenta_Grupo_${this.grupoSeleccionado}_Anio_${this.anioSeleccionado}.pdf`;
      link.click();
      URL.revokeObjectURL(fileURL);
    },
    error: (err) => {
      console.error('Error al descargar PDF del grupo:', err);
    }
  });
}


}
