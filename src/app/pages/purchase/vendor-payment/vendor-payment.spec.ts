import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPayment } from './vendor-payment';

describe('VendorPayment', () => {
  let component: VendorPayment;
  let fixture: ComponentFixture<VendorPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorPayment],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorPayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
