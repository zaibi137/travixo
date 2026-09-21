import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReceipt } from './customer-receipt';

describe('CustomerReceipt', () => {
  let component: CustomerReceipt;
  let fixture: ComponentFixture<CustomerReceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerReceipt],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerReceipt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
