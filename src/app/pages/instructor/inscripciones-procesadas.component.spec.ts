import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionesProcesadasComponent } from './inscripciones-procesadas.component';

describe('InscripcionesProcesadasComponent', () => {
  let component: InscripcionesProcesadasComponent;
  let fixture: ComponentFixture<InscripcionesProcesadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscripcionesProcesadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscripcionesProcesadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
