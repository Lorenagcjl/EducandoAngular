import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearEventoComponent } from './modal-crear-evento.component';

describe('ModalCrearEventoComponent', () => {
  let component: ModalCrearEventoComponent;
  let fixture: ComponentFixture<ModalCrearEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCrearEventoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCrearEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
