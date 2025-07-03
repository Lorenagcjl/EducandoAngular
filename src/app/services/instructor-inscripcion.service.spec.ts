import { TestBed } from '@angular/core/testing';

import { InstructorInscripcionService } from './instructor-inscripcion.service';

describe('InstructorInscripcionService', () => {
  let service: InstructorInscripcionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructorInscripcionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
