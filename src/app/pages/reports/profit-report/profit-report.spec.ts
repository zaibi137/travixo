import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitReport } from './profit-report';

describe('ProfitReport', () => {
  let component: ProfitReport;
  let fixture: ComponentFixture<ProfitReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfitReport],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfitReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
