import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarEventoComponent } from './modal-editar-evento.component';

describe('ModalEditarEventoComponent', () => {
  let component: ModalEditarEventoComponent;
  let fixture: ComponentFixture<ModalEditarEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarEventoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
