import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventosService } from '../../services/evento.service';
import { fechaNoPasadaValidator } from '../../components/calendario-eventos.component';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-modal-crear-evento',
  templateUrl: './modal-crear-evento.component.html',
  styleUrls: ['./modal-crear-evento.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ModalCrearEventoComponent implements OnInit {
  @Input() fecha: string = '';
  eventoForm: FormGroup;
  error: string = '';
  enviado = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private eventosService: EventosService
  ) {
    this.eventoForm = this.fb.group({
      nombreEvento: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: [''],
      fechaEvento: ['', [Validators.required, fechaNoPasadaValidator()]],
      inicioEvento:['', Validators.required],
      finEvento: [''],
      lugar: ['',[Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    if (this.fecha) {
      this.eventoForm.patchValue({ fechaEvento: this.fecha });
    }
  }

  get f() {
    return this.eventoForm.controls;
  }

  guardar(): void {
  this.enviado = true;
  if (this.eventoForm.invalid) return;

  const formValue = this.eventoForm.value;

  const evento = {
    ...formValue,
    fechaEvento: formValue.fechaEvento, // YYYY-MM-DD, ya está bien
    inicioEvento: formValue.inicioEvento ? formValue.inicioEvento : null,  // "" => null
    finEvento: formValue.finEvento ? formValue.finEvento : null,          // "" => null
  };

  console.log(evento);

  this.eventosService.crearEvento(evento).subscribe({
    next: () => {
      // Mostrar SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Evento creado',
        text: 'El evento ha sido creado correctamente',
        timer: 2000,          // 2 segundos
        showConfirmButton: false
      }).then(() => {
        this.activeModal.close('creado'); // Cerrar modal después de aceptar
      });
    },
    error: err => {
      this.error = 'Error al crear el evento';
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el evento. Intenta de nuevo.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  });
}


}
