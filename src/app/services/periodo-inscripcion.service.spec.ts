import { TestBed } from '@angular/core/testing';

import { PeriodoInscripcionService } from './periodo-inscripcion.service';

describe('PeriodoInscripcionService', () => {
  let service: PeriodoInscripcionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodoInscripcionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
