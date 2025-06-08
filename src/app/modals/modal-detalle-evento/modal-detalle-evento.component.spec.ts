import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleEventoComponent } from './modal-detalle-evento.component';

describe('ModalDetalleEventoComponent', () => {
  let component: ModalDetalleEventoComponent;
  let fixture: ComponentFixture<ModalDetalleEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetalleEventoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
