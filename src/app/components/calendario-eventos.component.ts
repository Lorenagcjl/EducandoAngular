import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EventosService } from '../services/evento.service';
import { AuthService } from '../auth/auth.service';
import { Evento } from '../models/evento.model';
import { forkJoin } from 'rxjs';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';

import { ModalCrearEventoComponent } from '../modals/modal-crear-evento/modal-crear-evento.component';
import { ModalDetalleEventoComponent } from '../modals/modal-detalle-evento/modal-detalle-evento.component';
import { ModalEditarEventoComponent } from '../modals/modal-editar-evento/modal-editar-evento.component';
// import { ModalConfirmacionComponent } from '../modals/modal-confirmacion/modal-confirmacion.component'; // Si usas un modal de confirmación personalizado

export function fechaNoPasadaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fecha = control.value;
    if (!fecha) return null;

    const fechaEvento = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return fechaEvento < hoy ? { fechaPasada: true } : null;
  };
}

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule, FullCalendarModule],
  templateUrl: './calendario-eventos.component.html',
  styleUrls: ['./calendario-eventos.component.css']
})
export class CalendarioEventosComponent implements OnInit {
  eventoForm: FormGroup;
  eventoSeleccionado: any = null;
  imagenesSeleccionadas: File[] = [];
  cargando = false;

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  eventos: Evento[] = [];
  rolUsuario: string | null = null;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth',
    events: [],
    editable: false,
    eventClick: this.onEventClick.bind(this),
    dateClick: this.onDateClick.bind(this),
  };

  constructor(
    private eventosService: EventosService,
    private authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.eventoForm = this.fb.group({
      nombreEvento: ['', Validators.required],
      fechaEvento: ['', [Validators.required, fechaNoPasadaValidator()]],
      descripcion: [''],
      lugar: ['']
    });
  }

  ngOnInit(): void {
    this.rolUsuario = this.authService.getRole();
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.cargando = true;
    this.eventosService.obtenerEventos().subscribe({
      next: (data) => {
        this.eventos = data;
        this.calendarOptions.events = data.map(e => ({
          id: e.idEvento.toString(),
          title: e.nombreEvento,
          start: e.fechaEvento,
          allDay: true
        }));
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando eventos', err);
        this.cargando = false;
      }
    });
  }

  puedeCrear(): boolean {
    return this.rolUsuario === 'Administrador';
  }

  puedeEditar(): boolean {
    return this.rolUsuario === 'Administrador' || this.rolUsuario === 'Instructor';
  }

  puedeVer(): boolean {
    return !!this.rolUsuario;
  }

  onDateClick(arg: any): void {
    if (!this.puedeCrear()) return;

    const modalRef = this.modalService.open(ModalCrearEventoComponent, { size: 'lg'});
modalRef.componentInstance.fecha = arg.dateStr;

    modalRef.result.then(() => this.cargarEventos(), () => {});
  }

  onEventClick(arg: any): void {
    const id = parseInt(arg.event.id, 10);

    this.eventosService.obtenerEventoPorId(id).subscribe({
      next: (evento) => {
        const modalRef = this.modalService.open(ModalDetalleEventoComponent, { size: 'lg'  });
        modalRef.componentInstance.evento = evento;

        modalRef.componentInstance.onEditar.subscribe(() => {
          this.abrirModalEditar(evento);
        });

        modalRef.componentInstance.onEliminar.subscribe(() => {
          this.eliminarEvento(evento);
        });
      },
      error: (err) => console.error('Error obteniendo evento', err)
    });
  }

  abrirModalEditar(evento: Evento): void {
  const modalRef = this.modalService.open(ModalEditarEventoComponent, { size: 'lg' });
  modalRef.componentInstance.evento = { ...evento };

  modalRef.componentInstance.onGuardar.subscribe((payload: { datosEvento: any, imagenes: File[] }) => {
    const formData = new FormData();
    formData.append('IdEvento', payload.datosEvento.idEvento.toString());
    formData.append('NombreEvento', payload.datosEvento.nombreEvento);
    formData.append('FechaEvento', payload.datosEvento.fechaEvento);

    if (payload.datosEvento.descripcion)
      formData.append('Descripcion', payload.datosEvento.descripcion);

    if (payload.datosEvento.inicioEvento)
      formData.append('InicioEvento', payload.datosEvento.inicioEvento);

    if (payload.datosEvento.finEvento)
      formData.append('FinEvento', payload.datosEvento.finEvento);

    if (payload.datosEvento.lugar)
      formData.append('Lugar', payload.datosEvento.lugar);

    if (payload.datosEvento.maquillaje)
      formData.append('Maquillaje', payload.datosEvento.maquillaje);

    if (payload.datosEvento.peinado)
      formData.append('Peinado', payload.datosEvento.peinado);

    this.eventosService.editarEvento(payload.datosEvento.idEvento, formData).subscribe({
      next: () => {
        if (payload.imagenes.length > 0) {
          const uploads = payload.imagenes.map(file => {
            const imgFormData = new FormData();
            imgFormData.append('IdEvento', payload.datosEvento.idEvento.toString());
            imgFormData.append('Archivo', file);
            return this.eventosService.subirImagen(imgFormData);
          });

          forkJoin(uploads).subscribe({
            next: () => {
              modalRef.close();
              this.cargarEventos();
            },
            error: err => {
  console.error('Error subiendo imágenes', err);
  alert(`Error al subir imágenes: ${err.status} - ${err.error || err.message}`);
}

          });
        } else {
          modalRef.close();
          this.cargarEventos();
        }
      },
      error: err => {
        console.error('Error al editar evento', err);
        alert(`Error: ${err.status} - ${err.error?.mensaje || err.message}`);
      }
    });
  });
}

  eliminarEvento(evento: Evento): void {
    const confirmacion = confirm(`¿Estás segura de que deseas eliminar el evento "${evento.nombreEvento}"?`);

    if (confirmacion) {
      this.eventosService.eliminarEvento(evento.idEvento).subscribe({
        next: () => this.cargarEventos(),
        error: (err) => console.error('Error al eliminar evento:', err)
      });
    }
  }

  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    const validFiles = files.filter(file =>
      file.type.startsWith('image/') && file.size < 5 * 1024 * 1024 // max 5MB
    );
    this.imagenesSeleccionadas = validFiles;
  }
  onHoyClick(): void {
  const hoy = new Date().toISOString().slice(0, 10);
  this.onDateClick({ dateStr: hoy });
}

}
