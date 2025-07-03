import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciasService } from '../../services/asistencia.service';
import { AsistenciaResumenDTO } from '../../models/asistencia.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resumen-asistencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resumen-asistencias.component.html',
  styleUrls: ['./resumen-asistencias.component.css']
})
export class ResumenAsistenciasComponent implements OnInit {
  resumen: AsistenciaResumenDTO[] = [];
  eventos: { idEvento: number; nombreEvento: string; fechaEvento: string }[] = [];
  eventosFiltrados: { idEvento: number; nombreEvento: string; fechaEvento: string }[] = [];
  usuarios: {
    idUsuario: number;
    nombreCompleto: string;
    fechaRegistro: string;
    resumenMensual: { mes: string; porcentaje: number }[];
  }[] = [];

  usuariosFiltrados: typeof this.usuarios = [];

  estadosMapa = new Map<string, string>();

  meses = [
    { value: '01', nombre: 'Enero' },
    { value: '02', nombre: 'Febrero' },
    { value: '03', nombre: 'Marzo' },
    { value: '04', nombre: 'Abril' },
    { value: '05', nombre: 'Mayo' },
    { value: '06', nombre: 'Junio' },
    { value: '07', nombre: 'Julio' },
    { value: '08', nombre: 'Agosto' },
    { value: '09', nombre: 'Septiembre' },
    { value: '10', nombre: 'Octubre' },
    { value: '11', nombre: 'Noviembre' },
    { value: '12', nombre: 'Diciembre' }
  ];

  anios: string[] = [];
  filtroMes: string = '';
  filtroAnio: string = '';
  filtroNombre: string = '';

  constructor(private asistenciasService: AsistenciasService) {}

  ngOnInit(): void {
    // Selecciona mes y año actuales al iniciar
    const hoy = new Date();
    this.filtroMes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    this.filtroAnio = hoy.getFullYear().toString();

    // Ejemplo: mostrar últimos 5 años (incluido este)
    const yearActual = hoy.getFullYear();
    for (let i = 0; i < 5; i++) {
      this.anios.push((yearActual - i).toString());
    }

    this.cargarResumen();
  }

  onCambioMesAnio() {
    this.cargarResumen();
  }

  cargarResumen() {
    this.asistenciasService.getResumenAsistencias().subscribe(data => {
      this.estadosMapa.clear();

      const eventosMap = new Map<number, { nombreEvento: string; fechaEvento: string }>();
      const usuariosMap = new Map<number, { nombreCompleto: string; fechaRegistro: string }>();
      const resumenPorUsuario = new Map<number, AsistenciaResumenDTO[]>();

      data.forEach(item => {
        eventosMap.set(item.idEvento, {
          nombreEvento: item.nombreEvento,
          fechaEvento: item.fechaEvento
        });

        usuariosMap.set(item.idUsuario, {
          nombreCompleto: item.nombreCompleto,
          fechaRegistro: item.fechaRegistro
        });

        if (!resumenPorUsuario.has(item.idUsuario)) {
          resumenPorUsuario.set(item.idUsuario, []);
        }
        resumenPorUsuario.get(item.idUsuario)!.push(item);

        const estadoOriginal = item.estadoAsistencia ?? '';
        const estado = ['Presente', 'Ausente', 'Justificado'].includes(estadoOriginal.trim())
          ? estadoOriginal.trim()
          : 'No registrado';

        this.estadosMapa.set(`${item.idUsuario}_${item.idEvento}`, estado);
      });

      this.eventos = Array.from(eventosMap.entries())
        .map(([idEvento, ev]) => ({ idEvento, ...ev }))
        .sort((a, b) => new Date(a.fechaEvento).getTime() - new Date(b.fechaEvento).getTime());

      // Filtrar eventos solo del mes y año seleccionados
      this.eventosFiltrados = this.eventos.filter(ev => {
        const fecha = new Date(ev.fechaEvento);
        const anio = fecha.getFullYear().toString();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        return anio === this.filtroAnio && mes === this.filtroMes;
      });

      this.usuarios = Array.from(usuariosMap.entries())
        .map(([idUsuario, datos]) => {
          const asistencias = resumenPorUsuario.get(idUsuario) || [];
          const fechaRegistro = new Date(datos.fechaRegistro);
          const fechaValida = !isNaN(fechaRegistro.getTime());

          // Solo eventos desde la fecha de ingreso
          const eventosDesdeIngreso = fechaValida
            ? asistencias.filter(a => new Date(a.fechaEvento) >= fechaRegistro)
            : asistencias;

          const agrupadosPorMes = new Map<string, AsistenciaResumenDTO[]>();
          eventosDesdeIngreso.forEach(item => {
            const fecha = new Date(item.fechaEvento);
            const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            if (!agrupadosPorMes.has(mesKey)) agrupadosPorMes.set(mesKey, []);
            agrupadosPorMes.get(mesKey)!.push(item);
          });

          const resumenMensual: { mes: string; porcentaje: number }[] = [];

          agrupadosPorMes.forEach((asistenciasDelMes, mes) => {
            if (mes === `${this.filtroAnio}-${this.filtroMes}`) {
              const total = asistenciasDelMes.length;
              const asistenciasValidas = asistenciasDelMes.filter(a =>
                ['Presente', 'Justificado'].includes((a.estadoAsistencia || '').trim())
              ).length;

              const porcentaje = total > 0 ? Math.round((asistenciasValidas / total) * 100) : 0;
              resumenMensual.push({ mes, porcentaje });
            }
          });

          if (resumenMensual.length === 0) {
            resumenMensual.push({
              mes: `${this.filtroAnio}-${this.filtroMes}`,
              porcentaje: 0
            });
          }

          return {
            idUsuario,
            nombreCompleto: datos.nombreCompleto,
            fechaRegistro: datos.fechaRegistro,
            resumenMensual
          };
        })
        .sort((a, b) => {
          const apellidoA = this.obtenerApellido(a.nombreCompleto);
          const apellidoB = this.obtenerApellido(b.nombreCompleto);
          return apellidoA.localeCompare(apellidoB);
        });

      this.filtrarUsuarios(); // Aplicar filtro de nombre actual si hay
    });
  }

  filtrarUsuarios() {
    const filtro = this.filtroNombre.trim().toLowerCase();

    if (!filtro) {
      this.usuariosFiltrados = this.usuarios;
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.nombreCompleto.toLowerCase().includes(filtro)
    );
  }

  obtenerApellido(nombreCompleto: string): string {
    const partes = nombreCompleto.trim().split(' ');
    return partes.length > 1 ? partes[partes.length - 1].toLowerCase() : nombreCompleto.toLowerCase();
  }

  obtenerEstado(idUsuario: number, idEvento: number): string {
    return this.estadosMapa.get(`${idUsuario}_${idEvento}`) ?? 'No registrado';
  }

  actualizarEstado(idUsuario: number, idEvento: number, estado: string) {
  const dto = { idUsuario, idEvento, estadoAsistencia: estado };
  this.asistenciasService.marcarAsistenciaIndividual(dto).subscribe({
    next: () => {
      this.estadosMapa.set(`${idUsuario}_${idEvento}`, estado);
      this.cargarResumen(); // actualizar lista y porcentaje
    },
    error: err => {
      console.error('Error al actualizar la asistencia:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar asistencia',
        text: err?.error || 'Ha ocurrido un error al actualizar la asistencia.',
        confirmButtonColor: '#d33'
      });
    }
  });
}
  descargarPDF() {
  // Construye el payload y llama al servicio
  this.generarPDFConFiltros();
}

generarPDFConFiltros() {
  // Construir el array de resumen según lo que tienes en frontend
  const resumen = this.usuariosFiltrados.flatMap(usuario =>
    this.eventosFiltrados.map(evento => {
      const estado = this.estadosMapa.get(`${usuario.idUsuario}_${evento.idEvento}`) ?? 'No registrado';

      return {
        idUsuario: usuario.idUsuario,
        nombreCompleto: usuario.nombreCompleto,
        fechaRegistro: usuario.fechaRegistro,
        idEvento: evento.idEvento,
        nombreEvento: evento.nombreEvento,
        fechaEvento: evento.fechaEvento, // asumo que ya es string o Date compatible con backend
        estadoAsistencia: estado
      };
    })
  );

  // Obtener mes y año seleccionados
  const mesNombre = this.meses.find(m => m.value === this.filtroMes)?.nombre ?? '';
  const anio = this.filtroAnio;

  // Payload completo
  const filtros = {
    resumen,
    mesNombre,
    anio
  };

  // Llamada al servicio para obtener PDF
  this.asistenciasService.generarPDF(filtros).subscribe(response => {
    // Crear Blob del PDF recibido
    const blob = new Blob([response], { type: 'application/pdf' });
    // Crear URL temporal
    const url = window.URL.createObjectURL(blob);
    // Abrir en nueva pestaña
    window.open(url);
  }, error => {
    console.error('Error al generar PDF:', error);
  });
}

  obtenerClaseIcono(estado: string): string {
    switch (estado) {
      case 'Presente':
        return 'bi bi-check-circle-fill text-success';
      case 'Ausente':
        return 'bi bi-x-circle-fill text-danger';
      case 'Justificado':
        return 'bi bi-exclamation-circle-fill text-warning';
      case 'No registrado':
      default:
        return 'bi bi-dash-circle text-secondary';
    }
  }
}
