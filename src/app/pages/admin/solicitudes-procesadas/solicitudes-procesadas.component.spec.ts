import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesProcesadasComponent } from './solicitudes-procesadas.component';

describe('SolicitudesProcesadasComponent', () => {
  let component: SolicitudesProcesadasComponent;
  let fixture: ComponentFixture<SolicitudesProcesadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesProcesadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesProcesadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
