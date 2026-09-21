import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInvoiceComponent } from './customer-invoice';

describe('CustomerInvoiceComponent', () => {
  let component: CustomerInvoiceComponent;
  let fixture: ComponentFixture<CustomerInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerInvoiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerInvoiceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});