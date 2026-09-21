import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseAllocation } from './expense-allocation';

describe('ExpenseAllocation', () => {
  let component: ExpenseAllocation;
  let fixture: ComponentFixture<ExpenseAllocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseAllocation],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseAllocation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
