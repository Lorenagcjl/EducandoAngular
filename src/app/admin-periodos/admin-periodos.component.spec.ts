import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPeriodosComponent } from './admin-periodos.component';

describe('AdminPeriodosComponent', () => {
  let component: AdminPeriodosComponent;
  let fixture: ComponentFixture<AdminPeriodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPeriodosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPeriodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
