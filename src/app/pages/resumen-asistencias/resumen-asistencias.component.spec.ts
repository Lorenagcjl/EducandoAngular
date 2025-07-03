import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenAsistenciasComponent } from './resumen-asistencias.component';

describe('ResumenAsistenciasComponent', () => {
  let component: ResumenAsistenciasComponent;
  let fixture: ComponentFixture<ResumenAsistenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenAsistenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenAsistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
