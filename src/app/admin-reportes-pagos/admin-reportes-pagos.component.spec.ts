import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportesPagosComponent } from './admin-reportes-pagos.component';

describe('AdminReportesPagosComponent', () => {
  let component: AdminReportesPagosComponent;
  let fixture: ComponentFixture<AdminReportesPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReportesPagosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReportesPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
