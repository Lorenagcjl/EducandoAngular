import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionesPendientesComponent } from './inscripciones-pendientes.component';

describe('InscripcionesPendientesComponent', () => {
  let component: InscripcionesPendientesComponent;
  let fixture: ComponentFixture<InscripcionesPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscripcionesPendientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscripcionesPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
