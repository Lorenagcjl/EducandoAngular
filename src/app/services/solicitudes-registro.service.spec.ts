import { TestBed } from '@angular/core/testing';

import { SolicitudesRegistroService } from './solicitudes-registro.service';

describe('SolicitudesRegistroService', () => {
  let service: SolicitudesRegistroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudesRegistroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
