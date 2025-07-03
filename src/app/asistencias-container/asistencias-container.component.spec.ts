import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciasContainerComponent } from './asistencias-container.component';

describe('AsistenciasContainerComponent', () => {
  let component: AsistenciasContainerComponent;
  let fixture: ComponentFixture<AsistenciasContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenciasContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciasContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
